import { ResponsivePie } from '@nivo/pie';

import { ItemContainer } from '.';

const ResourceTypes = ({ data }) => {
    return (
        <ItemContainer>
            <ResponsivePie
                data={data}
                margin={{ top: 0, right: 63, bottom: 70, left: 55 }}
                innerRadius={0.4}
                startAngle={-90}
                endAngle={270}
                padAngle={0.5}
                cornerRadius={2}
                colors={['#557237', '#6e9347', '#86b357', '#9fd466', '#e7f7d7']}
                activeOuterRadiusOffset={4}
                arcLinkLabelsDiagonalLength={4}
                arcLinkLabelsStraightLength={8}
                arcLinkLabelsSkipAngle={6}
                arcLinkLabelsTextColor="#333333"
                arcLinkLabelsThickness={2}
                arcLinkLabelsColor={{ from: 'color' }}
                arcLabelsSkipAngle={10}
                arcLabelsTextColor={{
                    from: 'color',
                    modifiers: [['darker', 2]]
                }}
                enableArcLabels={false}
                tooltip={item => (
                    <span
                        style={{
                            whiteSpace: 'nowrap',
                            backgroundColor: 'white',
                            padding: '5px'
                        }}
                    >
                        {item.datum.id}: {item.datum.value} resources
                    </span>
                )}
            />
            <h2>Top 5 resource types</h2>
        </ItemContainer>
    );
};

export default ResourceTypes;
