import { ResponsiveBar } from '@nivo/bar';

import { ChartContainer } from '.';

const Decades = ({ data }) => {
    return (
        <ChartContainer>
            <ResponsiveBar
                data={data.countsPerDecade}
                indexBy="decade"
                keys={['count']}
                enableLabel={false}
                tooltip={({ indexValue, value }) => {
                    return (
                        <div
                            style={{
                                whiteSpace: 'nowrap',
                                backgroundColor: 'white',
                                fontSize: '14px',
                                width: 'fit-content',
                                textAlign: 'center',
                                padding: '5px'
                            }}
                        >
                            <i>{indexValue}</i>
                            <br />
                            <b>
                                <big>{value}</big>
                            </b>
                        </div>
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
        </ChartContainer>
    );
};

export default Decades;
