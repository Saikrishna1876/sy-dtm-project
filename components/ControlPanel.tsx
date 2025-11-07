'use client';

import { CircuitStats } from '@/lib/types';
import { Trash2, Activity, Zap, ToggleLeft, Lightbulb } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface ControlPanelProps {
  stats: CircuitStats;
  onReset: () => void;
}

export default function ControlPanel({ stats, onReset }: ControlPanelProps) {
  return (
    <div className="bg-white border-t border-gray-200 p-4">
      <div className="flex items-center justify-between gap-4 max-w-full mr-auto">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-semibold text-gray-700">Circuit Stats</span>
          </div>

          <Card className="flex items-center gap-2 px-3 py-2 bg-gray-50 border-gray-200">
            <ToggleLeft className="w-4 h-4 text-green-600" />
            <span className="text-xs font-medium text-gray-600">
              Inputs: <span className="font-bold text-gray-900">{stats.inputCount}</span>
            </span>
          </Card>

          <Card className="flex items-center gap-2 px-3 py-2 bg-gray-50 border-gray-200">
            <Zap className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-medium text-gray-600">
              Gates: <span className="font-bold text-gray-900">{stats.gateCount}</span>
            </span>
          </Card>

          <Card className="flex items-center gap-2 px-3 py-2 bg-gray-50 border-gray-200">
            <Lightbulb className="w-4 h-4 text-yellow-600" />
            <span className="text-xs font-medium text-gray-600">
              Outputs: <span className="font-bold text-gray-900">{stats.outputCount}</span>
            </span>
          </Card>

          <Card className="flex items-center gap-2 px-3 py-2 bg-gray-50 border-gray-200">
            <div className="w-4 h-4 flex items-center justify-center">
              <div className="w-3 h-0.5 bg-gray-600 rounded" />
            </div>
            <span className="text-xs font-medium text-gray-600">
              Connections: <span className="font-bold text-gray-900">{stats.edgeCount}</span>
            </span>
          </Card>
        </div>

        <Button
          onClick={onReset}
          variant="destructive"
          size="sm"
          className="flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Reset Circuit
        </Button>
      </div>
    </div>
  );
}
