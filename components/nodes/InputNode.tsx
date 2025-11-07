'use client';

import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { GateNodeData } from '@/lib/types';
import { ToggleLeft, ToggleRight } from 'lucide-react';

interface InputNodeProps {
  data: GateNodeData;
  id: string;
}

const InputNode = memo(({ data, id }: InputNodeProps) => {
  const isOn = data.value === 1;

  return (
    <div className="bg-white border-2 border-gray-300 rounded-lg shadow-lg">
      <div className="px-4 py-3 flex flex-col items-center gap-2">
        <span className="text-xs font-semibold text-gray-600">INPUT</span>
        <div
          className={`flex items-center justify-center w-16 h-8 rounded-full cursor-pointer transition-colors ${
            isOn ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          {isOn ? (
            <ToggleRight className="w-6 h-6 text-white" />
          ) : (
            <ToggleLeft className="w-6 h-6 text-white" />
          )}
        </div>
        <span className="text-sm font-bold text-gray-800">{isOn ? '1' : '0'}</span>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        id="output"
        style={{
          top: '50%',
          background: isOn ? '#22c55e' : '#ef4444',
          width: '12px',
          height: '12px',
          border: '2px solid white',
        }}
      />
    </div>
  );
});

InputNode.displayName = 'InputNode';

export default InputNode;
