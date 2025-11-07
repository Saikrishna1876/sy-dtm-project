'use client';

import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { GateNodeData } from '@/lib/types';
import { Lightbulb } from 'lucide-react';

interface OutputNodeProps {
  data: GateNodeData;
  id: string;
}

const OutputNode = memo(({ data }: OutputNodeProps) => {
  const value = data.value;
  const isOn = value === 1;
  const isOff = value === 0;

  return (
    <div className="bg-white border-2 border-gray-300 rounded-lg shadow-lg">
      <div className="px-4 py-3 flex flex-col items-center gap-2">
        <span className="text-xs font-semibold text-gray-600">OUTPUT</span>
        <div
          className={`flex items-center justify-center w-12 h-12 rounded-full transition-all ${
            isOn
              ? 'bg-green-500 shadow-lg shadow-green-300'
              : isOff
              ? 'bg-red-500 shadow-lg shadow-red-300'
              : 'bg-gray-300'
          }`}
        >
          <Lightbulb
            className={`w-6 h-6 ${
              isOn || isOff ? 'text-white' : 'text-gray-500'
            }`}
            fill={isOn ? 'white' : 'none'}
          />
        </div>
        <span className="text-sm font-bold text-gray-800">
          {value === null ? '-' : value}
        </span>
      </div>

      <Handle
        type="target"
        position={Position.Left}
        id="input-0"
        style={{
          top: '50%',
          background: '#6b7280',
          width: '12px',
          height: '12px',
          border: '2px solid white',
        }}
      />
    </div>
  );
});

OutputNode.displayName = 'OutputNode';

export default OutputNode;
