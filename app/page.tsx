'use client';

import { useState, useCallback } from 'react';
import { ReactFlowProvider } from 'reactflow';
import ComponentPalette from '@/components/ComponentPalette';
import CircuitCanvas from '@/components/CircuitCanvas';
import ControlPanel from '@/components/ControlPanel';
import { CircuitStats } from '@/lib/types';
import { Zap } from 'lucide-react';

export default function Home() {
  const [stats, setStats] = useState<CircuitStats>({
    nodeCount: 0,
    edgeCount: 0,
    inputCount: 0,
    outputCount: 0,
    gateCount: 0,
  });

  const [resetKey, setResetKey] = useState(0);

  const handleReset = useCallback(() => {
    setResetKey((prev) => prev + 1);
    setStats({
      nodeCount: 0,
      edgeCount: 0,
      inputCount: 0,
      outputCount: 0,
      gateCount: 0,
    });
  }, []);

  return (
    <ReactFlowProvider>
      <div className="flex flex-col h-screen bg-gray-100">

        <div className="flex flex-1 overflow-hidden">
          <ComponentPalette />
          <CircuitCanvas key={resetKey} onStatsChange={setStats} />
        </div>

        <ControlPanel stats={stats} onReset={handleReset} />
      </div>
    </ReactFlowProvider>
  );
}
