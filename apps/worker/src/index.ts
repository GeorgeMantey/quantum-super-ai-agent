import express from 'express';
import { orchestrate } from '@qsa/agents/orchestrator';
const app = express();
app.use(express.json());
app.post('/run', async (req, res) => {
  const out = await orchestrate({ goal: req.body.goal });
  res.json(out);
});
app.listen(8080, () => console.log('Worker up on :8080'));
