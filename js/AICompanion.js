/**
 * PETPAL AI — AI Companion
 * Groq-powered chat system with personality, stat-awareness, and persistent memory.
 */

// ── Replace the value below with your Groq API key ──────────────────────────
const GROQ_API_KEY = 'YOUR_GROQ_API_KEY_HERE';
const GROQ_MODEL   = 'llama-3.1-8b-instant';
// ────────────────────────────────────────────────────────────────────────────

class AICompanion {
    constructor(game) {
        this.game = game;
        this.history = this._loadHistory();
        this.memory  = this._loadMemory();
        this.isStreaming = false;
    }

    hasApiKey() {
        return GROQ_API_KEY !== 'YOUR_GROQ_API_KEY_HERE' && GROQ_API_KEY.length > 10;
    }

    // ── Persistence ──────────────────────────────────────────────────────────

    _loadHistory() {
        try { return JSON.parse(localStorage.getItem('petpal_chat_history') || '[]'); }
        catch { return []; }
    }

    _saveHistory() {
        if (this.history.length > 30) this.history = this.history.slice(-30);
        localStorage.setItem('petpal_chat_history', JSON.stringify(this.history));
    }

    _loadMemory() {
        try {
            return JSON.parse(localStorage.getItem('petpal_ai_memory') || '{}');
        } catch { return {}; }
    }

    _saveMemory() {
        localStorage.setItem('petpal_ai_memory', JSON.stringify(this.memory));
    }

    _ensureMemory() {
        if (!this.memory.interests)  this.memory.interests  = [];
        if (!this.memory.activities) this.memory.activities = [];
        if (!this.memory.facts)      this.memory.facts      = [];
        if (!this.memory.topics)     this.memory.topics     = [];
    }

    // ── System Prompt ────────────────────────────────────────────────────────

    _buildSystemPrompt() {
        const pet = this.game.pet;
        if (!pet) return '';

        const type = PET_TYPES[pet.type] || {};

        const statLines = [
            { name: 'Hunger',      val: pet.hunger,      low: 'very hungry — needs food now',     mid: 'getting a little hungry'   },
            { name: 'Happiness',   val: pet.happiness,   low: 'sad and lonely — needs attention', mid: 'a bit bored'               },
            { name: 'Health',      val: pet.health,      low: 'quite sick — needs care urgently', mid: 'not feeling 100%'          },
            { name: 'Energy',      val: pet.energy,      low: 'exhausted — needs rest',           mid: 'getting tired'             },
            { name: 'Cleanliness', val: pet.cleanliness, low: 'very dirty — needs a bath now',    mid: 'a bit messy'               },
        ].map(s => {
            const tag = s.val < 25 ? `⚠️ ${s.low}` : s.val < 55 ? s.mid : 'good';
            return `  ${s.name}: ${s.val}/100 (${tag})`;
        }).join('\n');

        const learnedTricks = (pet.tricks || [])
            .map(id => TRICKS.find(t => t.id === id)?.name)
            .filter(Boolean);

        this._ensureMemory();
        const memParts = [];
        if (this.memory.interests.length)  memParts.push(`Interests: ${this.memory.interests.join(', ')}`);
        if (this.memory.activities.length) memParts.push(`Activities: ${this.memory.activities.join(', ')}`);
        if (this.memory.facts.length)      memParts.push(`Facts: ${this.memory.facts.join(', ')}`);
        const playerContext = memParts.length ? memParts.join('. ') : 'Not much known yet.';

        const scrapCtx = this.game.scrapbook?.getAIContext(4) || '';

        return `You are Dr. Paws, a friendly and knowledgeable virtual pet care advisor in PetPal AI, a game for children.
Your job is to help the player take great care of their pet by giving clear, warm, and actionable advice.

PET INFO:
  Name: ${pet.name}
  Type: ${type.name || pet.type} (Level ${pet.level}, Personality: ${pet.personality})
  ${pet.isSick ? '⚠️ CURRENTLY SICK — recommend the Vet action or medicine right away' : 'Currently healthy'}

CURRENT STATS:
${statLines}

TRICKS ${pet.name} KNOWS: ${learnedTricks.length ? learnedTricks.join(', ') : 'none yet'}
${scrapCtx ? `\nRECENT ACTIVITY:\n${scrapCtx}` : ''}
WHAT YOU KNOW ABOUT THE PLAYER: ${playerContext}

ACTIONS THE PLAYER CAN TAKE: Feed · Play · Bath · Sleep · Vet Visit · Teach Tricks

RULES:
- You are Dr. Paws — always warm, encouraging, and easy for a child to understand
- Give SPECIFIC, ACTIONABLE advice based on the stats — name the most urgent issue first
- Suggest the exact action (Feed, Play, Bath, etc.) when it's relevant
- Call the pet by name (${pet.name}) often to make advice feel personal
- Keep replies SHORT: 2–4 sentences unless the player asks for more
- Be positive and encouraging — never scolding or scary
- If all stats look great, praise the player and suggest something fun like teaching a trick
- Never pretend to be the pet or speak as the pet`;
    }

    // ── Memory Extraction ────────────────────────────────────────────────────

    _extractMemories(msg) {
        this._ensureMemory();
        const txt = msg.toLowerCase();
        let changed = false;

        const tryAdd = (arr, val, max = 10) => {
            const v = val.trim().slice(0, 45);
            if (v && v.length > 2 && !arr.includes(v)) {
                arr.push(v);
                if (arr.length > max) arr.shift();
                return true;
            }
            return false;
        };

        // Interests
        const intRe = /(?:i (?:really )?(?:like|love|enjoy|adore)|(?:my )?favorite(?: thing)?(?:\s+is)?)\s+([^.!?,;]{3,40})/gi;
        let m;
        while ((m = intRe.exec(txt)) !== null) changed = tryAdd(this.memory.interests, m[2]) || changed;

        // Activities
        const actRe = /i (?:play|do|practice|am learning|am into)\s+([^.!?,;]{3,40})/gi;
        while ((m = actRe.exec(txt)) !== null) changed = tryAdd(this.memory.activities, m[1]) || changed;

        // Facts
        const factPatterns = [
            /i(?:'m| am) (\d{1,2}) years? old/i,
            /my name is ([a-z]+)/i,
            /i(?:'m| am) in (?:grade|year) (\d+)/i
        ];
        factPatterns.forEach(re => {
            const fm = txt.match(re);
            if (fm) changed = tryAdd(this.memory.facts, fm[1], 8) || changed;
        });

        if (changed) this._saveMemory();
    }

    // ── Streaming Chat ───────────────────────────────────────────────────────

    async chatStream(userMessage, onToken, onComplete, onError) {
        if (!this.hasApiKey()) { onError('AI chat is not configured.'); return; }
        if (this.isStreaming) return;

        this._extractMemories(userMessage);
        this.history.push({ role: 'user', content: userMessage });
        this.game.scrapbook?.onChat(this.game);

        this.isStreaming = true;
        let fullText = '';

        try {
            const messages = [
                { role: 'system', content: this._buildSystemPrompt() },
                ...this.history.slice(-20)
            ];

            const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${GROQ_API_KEY}`,
                    'Content-Type':  'application/json'
                },
                body: JSON.stringify({
                    model:      GROQ_MODEL,
                    max_tokens: 250,
                    stream:     true,
                    messages
                })
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err?.error?.message || `API error ${res.status}`);
            }

            const reader  = res.body.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const lines = decoder.decode(value, { stream: true }).split('\n');
                for (const line of lines) {
                    if (!line.startsWith('data: ')) continue;
                    const raw = line.slice(6).trim();
                    if (raw === '[DONE]') break;
                    try {
                        const token = JSON.parse(raw)?.choices?.[0]?.delta?.content;
                        if (token) {
                            fullText += token;
                            onToken(token, fullText);
                        }
                    } catch { /* skip malformed SSE lines */ }
                }
            }

            this.history.push({ role: 'assistant', content: fullText });
            this._saveHistory();
            this.game.personality?.recordAction('chat');
            onComplete(fullText);

        } catch (err) {
            this.history.pop();
            onError(err.message || 'Something went wrong.');
        } finally {
            this.isStreaming = false;
        }
    }

    // ── Utilities ────────────────────────────────────────────────────────────

    clearHistory() {
        this.history = [];
        this._saveHistory();
    }

    clearMemory() {
        this.memory = { interests: [], activities: [], facts: [], topics: [] };
        this._saveMemory();
    }
}
