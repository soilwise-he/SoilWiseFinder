import ToggleButton from './ToggleButton';

const PersonsAndOrganizations = ({ data, className }) => {
    return (
        <div>
            {data.map((item, index) => {
                item = JSON.parse(item);

                return (
                    <div
                        className={`${index >= 3 ? 'collapsed ' + className : ''} person_organization`}
                        key={'person-organization-' + index}
                    >
                        {item.person ? (
                            <div className="person">{`${item.person}${item.organization ? ' (' + item.organization + ')' : ''}`}</div>
                        ) : (
                            item.organization && (
                                <div className={'organization'}>
                                    {item.organization}
                                </div>
                            )
                        )}
                    </div>
                );
            })}
            {data.length > 3 && <ToggleButton className={className} />}
        </div>
    );
};

export default PersonsAndOrganizations;
