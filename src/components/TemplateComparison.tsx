import React from 'react';
import styled from '@emotion/styled';
import type { ArchitectureTemplate } from '../data/architectureTemplates';
import type { ServerNode } from '../types/architecture';

const PageContainer = styled.div`
  height: 100vh;
  overflow-y: auto;
  padding: 24px;
  background: #f5f7fa;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
`;

const ComparisonContainer = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  padding: 32px;
  margin: 0 auto;
  max-width: 1400px;
  min-height: calc(100vh - 48px);
`;

interface ComparisonGridProps {
  columnCount: number;
}

const ComparisonGrid = styled.div<ComparisonGridProps>`
  display: grid;
  grid-template-columns: 280px repeat(${props => props.columnCount}, 1fr);
  gap: 16px;
  margin-top: 24px;
`;

const HeaderCell = styled.div`
  background: #f8f9fa;
  padding: 20px;
  font-weight: 600;
  border-radius: 8px;
  text-align: center;
  border: 1px solid #e9ecef;
  position: sticky;
  top: 0;
  z-index: 10;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
`;

const Cell = styled.div`
  padding: 20px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  text-align: left;
  background: white;
  transition: all 0.2s ease;
  line-height: 1.6;

  &:hover {
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  }
`;

const MetricCell = styled(Cell)`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

interface MetricValueProps {
  color?: string;
}

const MetricValue = styled.span<MetricValueProps>`
  font-size: 24px;
  font-weight: 600;
  color: ${props => props.color || '#333'};
  display: block;
  margin-bottom: 8px;
`;

const MetricLabel = styled.span`
  font-size: 14px;
  color: #666;
  display: block;
  margin-bottom: 16px;
`;

const BestPracticeList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  text-align: left;
`;

interface BestPracticeItemProps {
  impact: 'high' | 'medium' | 'low';
}

const BestPracticeItem = styled.li<BestPracticeItemProps>`
  margin: 12px 0;
  padding: 12px 16px;
  border-left: 4px solid ${props => props.impact === 'high' ? '#e74c3c' : props.impact === 'medium' ? '#f1c40f' : '#2ecc71'};
  background: #f8f9fa;
  border-radius: 0 4px 4px 0;
  line-height: 1.6;
`;

const CostBreakdown = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
`;

const CostBar = styled.div<{ percentage: number }>`
  height: 12px;
  background: #3498db;
  width: ${props => props.percentage}%;
  border-radius: 6px;
  transition: width 0.3s ease;
`;

const CostLabel = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #666;
  margin-bottom: 6px;
  font-weight: 500;
`;

const PerformanceChart = styled.div`
  display: flex;
  align-items: flex-end;
  height: 140px;
  gap: 12px;
  margin: 20px 0;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
`;

const ChartBar = styled.div<{ height: number; color: string }>`
  flex: 1;
  background: ${props => props.color};
  height: ${props => props.height}%;
  border-radius: 4px 4px 0 0;
  transition: height 0.3s ease;
  position: relative;

  &:hover::after {
    content: attr(data-label);
    position: absolute;
    top: -25px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0,0,0,0.8);
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    white-space: nowrap;
  }
`;

const ComplianceBadge = styled.span`
  background: #3498db;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  margin: 2px;
  display: inline-block;
`;

const SectionTitle = styled.h3`
  margin: 32px 0 16px;
  color: #2c3e50;
  font-size: 20px;
  font-weight: 600;
  border-bottom: 2px solid #eee;
  padding-bottom: 12px;
  grid-column: 1 / -1;
`;

const DetailSection = styled.div`
  margin-top: 20px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  line-height: 1.6;

  &:first-of-type {
    margin-top: 0;
  }
`;

const DetailTitle = styled.h4`
  margin: 0 0 12px;
  color: #2c3e50;
  font-size: 16px;
  font-weight: 600;
`;

const DetailText = styled.p`
  margin: 0;
  color: #666;
  font-size: 14px;
  line-height: 1.6;
`;

const ServerDetailsSection = styled.div`
  margin-top: 20px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
`;

const ServerGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-top: 16px;
`;

const ServerCard = styled.div`
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
`;

const ServerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
`;

const ServerType = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #2c3e50;
`;

const ServerSpecs = styled.div`
  font-size: 13px;
  color: #666;
  line-height: 1.6;
`;

const SpecItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 4px 0;
`;

const SpecLabel = styled.span`
  color: #666;
`;

const SpecValue = styled.span`
  font-weight: 500;
  color: #2c3e50;
`;

const HealthIndicator = styled.div<{ isHealthy: boolean }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${props => props.isHealthy ? '#2ecc71' : '#e74c3c'};
  margin-left: 8px;
  box-shadow: 0 0 0 2px ${props => props.isHealthy ? 'rgba(46, 204, 113, 0.2)' : 'rgba(231, 76, 60, 0.2)'};
`;

const LoadValue = styled.span<{ load: number }>`
  font-weight: 500;
  color: ${props => 
    props.load > 80 ? '#e74c3c' :
    props.load > 50 ? '#f1c40f' :
    '#2ecc71'
  };
`;

interface TemplateComparisonProps {
  templates: ArchitectureTemplate[];
}

export default function TemplateComparison({ templates }: TemplateComparisonProps) {
  const getMetricColor = (value: number, metric: string) => {
    if (metric === 'latency') {
      return value < 20 ? '#2ecc71' : value < 40 ? '#f1c40f' : '#e74c3c';
    }
    if (metric === 'reliability') {
      return value > 99.99 ? '#2ecc71' : value > 99.9 ? '#f1c40f' : '#e74c3c';
    }
    return '#333';
  };

  const getScalabilityColor = (level: string) => {
    return level === 'high' ? '#2ecc71' : level === 'medium' ? '#f1c40f' : '#e74c3c';
  };

  const getMaintenanceColor = (level: string) => {
    return level === 'low' ? '#2ecc71' : level === 'medium' ? '#f1c40f' : '#e74c3c';
  };

  const maxCost = Math.max(...templates.map(t => t.costEstimate.monthly));

  return (
    <PageContainer>
      <ComparisonContainer>
        <h2 style={{ 
          marginBottom: '32px', 
          color: '#2c3e50',
          fontSize: '28px',
          fontWeight: '600',
          lineHeight: '1.3'
        }}>
          Architecture Template Comparison
        </h2>
        <ComparisonGrid columnCount={templates.length}>
          <HeaderCell>Metric</HeaderCell>
          {templates.map(template => (
            <HeaderCell key={template.name}>
              <div style={{ 
                fontSize: '20px', 
                fontWeight: 'bold', 
                marginBottom: '8px',
                lineHeight: '1.3'
              }}>
                {template.name}
              </div>
              <div style={{ 
                fontSize: '14px', 
                color: '#666',
                lineHeight: '1.4'
              }}>
                {template.category}
              </div>
            </HeaderCell>
          ))}

          <SectionTitle>Basic Information</SectionTitle>
          <HeaderCell style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            fontSize: '16px',
            fontWeight: '600',
            color: '#2c3e50'
          }}>
            Template Details
          </HeaderCell>
          {templates.map(template => (
            <Cell key={template.name}>
              <DetailSection>
                <DetailTitle>Complexity Level</DetailTitle>
                <DetailText>{template.complexity}</DetailText>
              </DetailSection>
              <DetailSection>
                <DetailTitle>Category</DetailTitle>
                <DetailText>{template.category}</DetailText>
              </DetailSection>
              <DetailSection>
                <DetailTitle>Recommended Throughput</DetailTitle>
                <DetailText>{template.recommendedThroughput} operations/second</DetailText>
              </DetailSection>
            </Cell>
          ))}

          <SectionTitle>Cost Analysis</SectionTitle>
          <HeaderCell style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            fontSize: '16px',
            fontWeight: '600',
            color: '#2c3e50'
          }}>
            Cost Breakdown
          </HeaderCell>
          {templates.map(template => (
            <Cell key={template.name}>
              <MetricValue>${template.costEstimate.monthly}/month</MetricValue>
              <MetricLabel>${template.costEstimate.hourly}/hour</MetricLabel>
              <CostBreakdown>
                <CostLabel>
                  <span>Compute Resources</span>
                  <span>${template.costEstimate.breakdown.compute}</span>
                </CostLabel>
                <CostBar percentage={(template.costEstimate.breakdown.compute / maxCost) * 100} />
                <CostLabel>
                  <span>Storage</span>
                  <span>${template.costEstimate.breakdown.storage}</span>
                </CostLabel>
                <CostBar percentage={(template.costEstimate.breakdown.storage / maxCost) * 100} />
                <CostLabel>
                  <span>Network Transfer</span>
                  <span>${template.costEstimate.breakdown.network}</span>
                </CostLabel>
                <CostBar percentage={(template.costEstimate.breakdown.network / maxCost) * 100} />
                <CostLabel>
                  <span>Maintenance & Support</span>
                  <span>${template.costEstimate.breakdown.maintenance}</span>
                </CostLabel>
                <CostBar percentage={(template.costEstimate.breakdown.maintenance / maxCost) * 100} />
              </CostBreakdown>
            </Cell>
          ))}

          <SectionTitle>Server Infrastructure</SectionTitle>
          <HeaderCell style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            fontSize: '16px',
            fontWeight: '600',
            color: '#2c3e50'
          }}>
            Server Configuration
          </HeaderCell>
          {templates.map(template => (
            <Cell key={template.name}>
              <ServerDetailsSection>
                <DetailTitle>Server Configuration</DetailTitle>
                <ServerGrid>
                  {template.initialState.nodes.map((server: ServerNode, index) => (
                    <ServerCard key={index}>
                      <ServerHeader>
                        <ServerType>{server.type}</ServerType>
                        <HealthIndicator isHealthy={server.isHealthy} />
                      </ServerHeader>
                      <ServerSpecs>
                        <SpecItem>
                          <SpecLabel>CPU</SpecLabel>
                          <SpecValue>{server.resources.cpu} GHz</SpecValue>
                        </SpecItem>
                        <SpecItem>
                          <SpecLabel>Cores</SpecLabel>
                          <SpecValue>{server.resources.cpuCores}</SpecValue>
                        </SpecItem>
                        <SpecItem>
                          <SpecLabel>Memory</SpecLabel>
                          <SpecValue>{server.resources.memory} GB</SpecValue>
                        </SpecItem>
                        <SpecItem>
                          <SpecLabel>Network</SpecLabel>
                          <SpecValue>{server.resources.networkBandwidth} Mbps</SpecValue>
                        </SpecItem>
                        <SpecItem>
                          <SpecLabel>Max Throughput</SpecLabel>
                          <SpecValue>{server.maxThroughput} ops/sec</SpecValue>
                        </SpecItem>
                        <SpecItem>
                          <SpecLabel>Current Load</SpecLabel>
                          <SpecValue>
                            <LoadValue load={server.currentLoad}>{server.currentLoad}%</LoadValue>
                          </SpecValue>
                        </SpecItem>
                      </ServerSpecs>
                    </ServerCard>
                  ))}
                </ServerGrid>
              </ServerDetailsSection>
            </Cell>
          ))}

          <SectionTitle>Performance Metrics</SectionTitle>
          <HeaderCell style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            fontSize: '16px',
            fontWeight: '600',
            color: '#2c3e50'
          }}>
            Performance Analysis
          </HeaderCell>
          {templates.map(template => (
            <Cell key={template.name}>
              <PerformanceChart>
                <ChartBar 
                  height={(template.performanceCharacteristics.latency / 100) * 100} 
                  color={getMetricColor(template.performanceCharacteristics.latency, 'latency')}
                  data-label={`Latency: ${template.performanceCharacteristics.latency}ms`}
                />
                <ChartBar 
                  height={template.performanceCharacteristics.reliability} 
                  color={getMetricColor(template.performanceCharacteristics.reliability, 'reliability')}
                  data-label={`Reliability: ${template.performanceCharacteristics.reliability}%`}
                />
                <ChartBar 
                  height={template.performanceCharacteristics.scalability === 'high' ? 100 : 
                         template.performanceCharacteristics.scalability === 'medium' ? 66 : 33} 
                  color={getScalabilityColor(template.performanceCharacteristics.scalability)}
                  data-label={`Scalability: ${template.performanceCharacteristics.scalability}`}
                />
              </PerformanceChart>
              <DetailSection>
                <DetailTitle>Latency</DetailTitle>
                <DetailText>{template.performanceCharacteristics.latency}ms average response time</DetailText>
              </DetailSection>
              <DetailSection>
                <DetailTitle>Reliability</DetailTitle>
                <DetailText>{template.performanceCharacteristics.reliability}% uptime guarantee</DetailText>
              </DetailSection>
              <DetailSection>
                <DetailTitle>Scalability</DetailTitle>
                <DetailText>{template.performanceCharacteristics.scalability} scaling capability</DetailText>
              </DetailSection>
              <DetailSection>
                <DetailTitle>Maintenance</DetailTitle>
                <DetailText>{template.performanceCharacteristics.maintenanceComplexity} maintenance complexity</DetailText>
              </DetailSection>
            </Cell>
          ))}

          <SectionTitle>Best Practices & Recommendations</SectionTitle>
          <HeaderCell style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            fontSize: '16px',
            fontWeight: '600',
            color: '#2c3e50'
          }}>
            Best Practices
          </HeaderCell>
          {templates.map(template => (
            <Cell key={template.name}>
              <BestPracticeList>
                {template.bestPractices.map((practice, index) => (
                  <BestPracticeItem key={index} impact={practice.impact}>
                    <div style={{ 
                      fontWeight: '600', 
                      marginBottom: '8px',
                      fontSize: '15px',
                      color: '#2c3e50'
                    }}>
                      {practice.title}
                    </div>
                    <div style={{ 
                      fontSize: '14px', 
                      color: '#666',
                      lineHeight: '1.6',
                      marginBottom: '8px'
                    }}>
                      {practice.description}
                    </div>
                    <div style={{ 
                      fontSize: '13px', 
                      color: '#666', 
                      fontStyle: 'italic',
                      fontWeight: '500'
                    }}>
                      Impact: {practice.impact.charAt(0).toUpperCase() + practice.impact.slice(1)}
                    </div>
                  </BestPracticeItem>
                ))}
              </BestPracticeList>
            </Cell>
          ))}
        </ComparisonGrid>
      </ComparisonContainer>
    </PageContainer>
  );
} 