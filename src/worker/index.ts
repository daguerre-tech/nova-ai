import { Hono } from 'hono';
import { cors } from 'hono/cors';
import {
  ConsultationRequestSchema,
  ContactMessageSchema,
  DemoRequestSchema,
} from '../shared/schemas.ts';
import type { CloudflareEnv, ProjectShowcase } from '../shared/types.ts';

const app = new Hono<{ Bindings: CloudflareEnv }>();

// Enable CORS for frontend requests
app.use('*', cors());

// In-memory fallback stores for when D1 binding is not configured in local environment
const localConsultations: Array<{
  id: string;
  fullName: string;
  email: string;
  company: string;
  teamSize: string;
  projectScope: string;
  notes?: string;
  createdAt: string;
}> = [];

const localMessages: Array<{
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}> = [];

// Static projects data showcasing 6 enterprise achievements
const PROJECTS_DATA: ProjectShowcase[] = [
  {
    id: 'proj-01',
    title: 'Autonomous Supply Signal Router',
    client: 'HyperLogistics Global',
    category: 'AI AUTOMATION',
    metric: '99.4% on-time dispatch precision',
    description:
      'Continuous telemetry interpretation across 12 warehouses with zero human intervention.',
  },
  {
    id: 'proj-02',
    title: 'Multi-Modal Visual Audit Pipeline',
    client: 'AeroSynthetics Corp',
    category: 'AI AUTOMATION',
    metric: '18x faster defect detection',
    description:
      'High-frame-rate computer vision analyzing composite wing structures with microscopic fidelity.',
  },
  {
    id: 'proj-03',
    title: 'Enterprise ERP Neural Interface',
    client: 'Nordic Financial Group',
    category: 'AI INTEGRATION',
    metric: '4.2h saved per team member weekly',
    description:
      'Direct cross-silo semantic query synthesis bridging legacy SAP and distributed ledger data.',
  },
  {
    id: 'proj-04',
    title: 'Regulated Compliance Agent Suite',
    client: 'Vanguard Biometrics',
    category: 'AI AGENT DEVELOPMENT',
    metric: '100% SEC/EU compliance coverage',
    description:
      'Self-auditing agent swarm monitoring high-frequency customer contract updates in real time.',
  },
  {
    id: 'proj-05',
    title: 'Adaptive Production Scheduling Mesh',
    client: 'Kvantum Mechatronics',
    category: 'AI AUTOMATION',
    metric: '32% decrease in machine idle latency',
    description:
      'Dynamic re-tooling orchestrator adjusting CNC queue parameters based on live yield metrics.',
  },
  {
    id: 'proj-06',
    title: 'Autonomous Executive Decision Briefs',
    client: 'Stratum Ventures',
    category: 'AI INTEGRATION',
    metric: 'Instant synthesis of 5,000+ documents',
    description:
      'Deep entity graph extraction providing daily actionable strategic insights to executive partners.',
  },
];

// Health check endpoint
app.get('/api/health', (c) => {
  return c.json({
    status: 'ok',
    service: 'NOVA_AI Cloudflare Worker',
    runtime: 'Cloudflare Workers (Edge)',
    hasD1: Boolean(c.env?.DB),
    hasR2: Boolean(c.env?.STORAGE),
    timestamp: new Date().toISOString(),
  });
});

// Get Projects showcase (for Projects 6 badge)
app.get('/api/projects', (c) => {
  return c.json({
    success: true,
    data: PROJECTS_DATA,
    count: PROJECTS_DATA.length,
    timestamp: new Date().toISOString(),
  });
});

// Book consultation endpoint (Talk with Mitha / Free Consultation)
app.post('/api/consultations', async (c) => {
  try {
    const body = await c.req.json();
    const parsed = ConsultationRequestSchema.safeParse(body);

    if (!parsed.success) {
      return c.json(
        {
          success: false,
          error: parsed.error.issues.map((i) => i.message).join(', '),
          timestamp: new Date().toISOString(),
        },
        400,
      );
    }

    const { fullName, email, company, teamSize, projectScope, notes } = parsed.data;
    const id = `consult-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const createdAt = new Date().toISOString();

    // If Cloudflare D1 binding is present, persist to D1 database
    if (c.env?.DB) {
      await c.env.DB.prepare(
        `INSERT INTO consultations (id, full_name, email, company, team_size, project_scope, notes, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      )
        .bind(id, fullName, email, company, teamSize, projectScope, notes || '', createdAt)
        .run();
    } else {
      localConsultations.push({
        id,
        fullName,
        email,
        company,
        teamSize,
        projectScope,
        notes,
        createdAt,
      });
    }

    return c.json({
      success: true,
      message: `Consultation confirmed with Mitha and the NovaAI team. A calendar invite has been queued for ${email}.`,
      data: {
        id,
        fullName,
        company,
        assignedSpecialist: 'Mitha (Co-founder & AI Strategy Lead)',
        estimatedCallDuration: '15 minutes',
      },
      timestamp: createdAt,
    });
  } catch (err: any) {
    return c.json(
      {
        success: false,
        error: err.message || 'Failed to process consultation booking',
        timestamp: new Date().toISOString(),
      },
      500,
    );
  }
});

// Contact message endpoint
app.post('/api/contact', async (c) => {
  try {
    const body = await c.req.json();
    const parsed = ContactMessageSchema.safeParse(body);

    if (!parsed.success) {
      return c.json(
        {
          success: false,
          error: parsed.error.issues.map((i) => i.message).join(', '),
          timestamp: new Date().toISOString(),
        },
        400,
      );
    }

    const { name, email, message } = parsed.data;
    const id = `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const createdAt = new Date().toISOString();

    if (c.env?.DB) {
      await c.env.DB.prepare(
        `INSERT INTO contact_messages (id, name, email, message, created_at)
         VALUES (?, ?, ?, ?, ?)`
      )
        .bind(id, name, email, message, createdAt)
        .run();
    } else {
      localMessages.push({ id, name, email, message, createdAt });
    }

    return c.json({
      success: true,
      message: 'Message delivered directly to NovaAI engineering leadership.',
      data: { id, name, email },
      timestamp: createdAt,
    });
  } catch (err: any) {
    return c.json(
      {
        success: false,
        error: err.message || 'Failed to send message',
        timestamp: new Date().toISOString(),
      },
      500,
    );
  }
});

// Interactive Demo Analysis endpoint
app.post('/api/demo/analyze', async (c) => {
  try {
    const body = await c.req.json();
    const parsed = DemoRequestSchema.safeParse(body);

    if (!parsed.success) {
      return c.json(
        {
          success: false,
          error: parsed.error.issues.map((i) => i.message).join(', '),
          timestamp: new Date().toISOString(),
        },
        400,
      );
    }

    const { pipeline, prompt } = parsed.data;

    let output = '';
    let latencyMs = 0;
    const metrics: Record<string, string> = {};

    if (pipeline === 'vision') {
      output = `[Real-Time Vision Pipeline] Context resolved in 14ms. Detected core intent: "${prompt}". Extracted 4 primary decision vectors with 99.8% visual-semantic confidence.`;
      latencyMs = 42;
      metrics.throughput = '120 fps continuous telemetry';
      metrics.precision = '0.002 latency jitter';
    } else if (pipeline === 'insight') {
      output = `[Layered Insight Pipeline] Rough blueprint parsed into 3-phase automated DAG. Eliminating redundant state transitions for prompt: "${prompt}". Synthesized actionable execution schema.`;
      latencyMs = 65;
      metrics.threadRetention = '100% context parity';
      metrics.compression = '4.8x token reduction';
    } else {
      output = `[Adaptive Speed Pipeline] Learned telemetry cadence for operational stream. Optimized dispatch path for: "${prompt}". Zero cold starts detected across edge clusters.`;
      latencyMs = 28;
      metrics.cadenceMatch = 'Adaptive 1.2ms cycle';
      metrics.clusterSync = 'Cloudflare Global Edge Mesh';
    }

    return c.json({
      success: true,
      data: {
        pipeline,
        prompt,
        output,
        latencyMs,
        metrics,
        edgeRegion: 'Cloudflare Worker Local Edge',
      },
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return c.json(
      {
        success: false,
        error: err.message || 'Demo simulation error',
        timestamp: new Date().toISOString(),
      },
      500,
    );
  }
});

export default app;
