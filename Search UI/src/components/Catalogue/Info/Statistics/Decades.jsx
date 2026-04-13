import { ResponsiveBar } from '@nivo/bar';

import { ItemContainer } from '.';

const Decades = ({ data }) => {
    return (
        <ItemContainer>
            <ResponsiveBar
                data={data.countsPerDecade}
                indexBy="decade"
                keys={['count']}
                enableLabel={false}
                tooltip={({ indexValue, value }) => {
                    return (
                        <span
                            style={{
                                whiteSpace: 'nowrap',
                                backgroundColor: 'white',
                                padding: '5px'
                            }}
                        >
                            {indexValue}: {value} resources
                        </span>
                    );
                }}
                axisBottom={null}
                axisLeft={null}
                enableGridX={false}
                enableGridY={false}
                margin={{ top: 10, right: 20, bottom: 100, left: 20 }}
                colors={Array.from(
                    { length: data.countsPerDecade.length },
                    (_, i) =>
                        data.countsPerDecade[i].isCoveredInFull
                            ? '#557237'
                            : '#9fd466'
                )}
                colorBy="indexValue"
            />
            <h2>Data & knowledge resources since {data.startYear}</h2>
        </ItemContainer>
    );
};

export default Decades;
