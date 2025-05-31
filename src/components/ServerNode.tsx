import React from 'react';
import { Handle, Position } from 'reactflow';
import styled from '@emotion/styled';

const NodeContainer = styled.div<{ isStartingPoint: boolean; isEndPoint: boolean }>`
  padding: 12px;
  border-radius: 8px;
  background: white;
  border: 2px solid ${props => 
    props.isStartingPoint ? '#e74c3c' : 
    props.isEndPoint ? '#2ecc71' : 
    '#ddd'
  };
  min-width: 180px;
  position: relative;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
    transform: translateY(-1px);
  }
`;

const NodeHeader = styled.div`
  font-weight: 600;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
`;

const NodeType = styled.span`
  font-size: 11px;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: #f5f5f5;
  padding: 2px 6px;
  border-radius: 4px;
`;

const ResourceList = styled.div`
  font-size: 12px;
  color: #666;
  margin: 8px 0;
`;

const ResourceItem = styled.div`
  margin: 6px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ResourceLabel = styled.span`
  color: #666;
`;

const ResourceValue = styled.span`
  font-weight: 500;
  color: #333;
`;

const HealthIndicator = styled.div<{ isHealthy: boolean }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${props => props.isHealthy ? '#2ecc71' : '#e74c3c'};
  margin-left: 8px;
  box-shadow: 0 0 0 2px ${props => props.isHealthy ? 'rgba(46, 204, 113, 0.2)' : 'rgba(231, 76, 60, 0.2)'};
`;

const LoadSection = styled.div`
  margin-top: 10px;
  padding-top: 8px;
  border-top: 1px solid #eee;
`;

const LoadHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
  font-size: 12px;
`;

const LoadValue = styled.span<{ load: number }>`
  font-weight: 500;
  color: ${props => 
    props.load > 80 ? '#e74c3c' :
    props.load > 50 ? '#f1c40f' :
    '#2ecc71'
  };
`;

const LoadIndicator = styled.div<{ load: number }>`
  height: 6px;
  background: ${props => 
    props.load > 80 ? '#e74c3c' :
    props.load > 50 ? '#f1c40f' :
    '#2ecc71'
  };
  width: ${props => props.load}%;
  border-radius: 3px;
  transition: width 0.3s ease;
`;

const HandleStyled = styled(Handle)`
  width: 8px;
  height: 8px;
  background: #666;
  border: 2px solid white;
  box-shadow: 0 0 0 1px #666;

  &:hover {
    background: #333;
  }
`;

interface ServerNodeProps {
  data: {
    id: string;
    type: string;
    resources: {
      cpu: number;
      cpuCores: number;
      memory: number;
      networkBandwidth: number;
    };
    currentLoad: number;
    maxThroughput: number;
    isHealthy: boolean;
    isStartingPoint: boolean;
    isEndPoint: boolean;
  };
}

export default function ServerNode({ data }: ServerNodeProps) {
  return (
    <NodeContainer 
      isStartingPoint={data.isStartingPoint}
      isEndPoint={data.isEndPoint}
    >
      <HandleStyled type="target" position={Position.Left} />
      <NodeHeader>
        <span>{data.id}</span>
        <HealthIndicator isHealthy={data.isHealthy} />
      </NodeHeader>
      <NodeType>{data.type}</NodeType>
      <ResourceList>
        <ResourceItem>
          <ResourceLabel>CPU</ResourceLabel>
          <ResourceValue>{data.resources.cpu} GHz</ResourceValue>
        </ResourceItem>
        <ResourceItem>
          <ResourceLabel>Cores</ResourceLabel>
          <ResourceValue>{data.resources.cpuCores}</ResourceValue>
        </ResourceItem>
        <ResourceItem>
          <ResourceLabel>Memory</ResourceLabel>
          <ResourceValue>{data.resources.memory} GB</ResourceValue>
        </ResourceItem>
        <ResourceItem>
          <ResourceLabel>Network</ResourceLabel>
          <ResourceValue>{data.resources.networkBandwidth} Mbps</ResourceValue>
        </ResourceItem>
      </ResourceList>
      <LoadSection>
        <LoadHeader>
          <span>Load</span>
          <LoadValue load={data.currentLoad}>{data.currentLoad}%</LoadValue>
        </LoadHeader>
        <LoadIndicator load={data.currentLoad} />
      </LoadSection>
      <HandleStyled type="source" position={Position.Right} />
    </NodeContainer>
  );
} 