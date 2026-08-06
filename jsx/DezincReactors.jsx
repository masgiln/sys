const { useState, useEffect } = React;

const DezincReactors = ({ viewName, Icon }) => {
    const [temp, setTemp] = useState(85.4);

    // Simulate live data
    useEffect(() => {
        const interval = setInterval(() => {
            setTemp(prev => prev + (Math.random() - 0.5));
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return React.createElement(
        'div',
        { style: { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' } },
        React.createElement(
            'div',
            { className: 'content-panel' },
            React.createElement(
                'div',
                { className: 'section-header' },
                React.createElement(
                    'h3',
                    null,
                    React.createElement(Icon, { name: 'operations' }),
                    ' ',
                    viewName,
                    ' Telemetry'
                )
            ),
            React.createElement(
                'div',
                {
                    style: {
                        background: '#111',
                        padding: '30px',
                        borderRadius: '12px',
                        color: '#00F0FF',
                        fontFamily: 'monospace',
                        position: 'relative',
                        overflow: 'hidden'
                    }
                },
                React.createElement('div', {
                    style: {
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '4px',
                        background: 'var(--accent-pink)'
                    }
                }),
                React.createElement(
                    'h2',
                    { style: { fontSize: '48px', margin: '0 0 10px 0', textShadow: '0 0 15px #00F0FF' } },
                    temp.toFixed(2) + ' °C'
                ),
                React.createElement(
                    'p',
                    { style: { color: '#aaa', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '12px' } },
                    'Reactor 1 Core Temperature (Nominal: 85.0 °C)'
                ),
                React.createElement(
                    'div',
                    { style: { display: 'flex', gap: '20px', marginTop: '30px' } },
                    React.createElement(
                        'div',
                        {
                            style: {
                                background: 'rgba(0,240,255,0.1)',
                                padding: '15px',
                                borderRadius: '8px',
                                border: '1px solid #00F0FF',
                                flex: 1
                            }
                        },
                        React.createElement('div', { style: { fontSize: '11px', color: '#aaa' } }, 'PRESSURE'),
                        React.createElement(
                            'div',
                            { style: { fontSize: '20px', color: '#fff', fontWeight: 'bold' } },
                            '12.4 bar'
                        )
                    ),
                    React.createElement(
                        'div',
                        {
                            style: {
                                background: 'rgba(0,240,255,0.1)',
                                padding: '15px',
                                borderRadius: '8px',
                                border: '1px solid #00F0FF',
                                flex: 1
                            }
                        },
                        React.createElement('div', { style: { fontSize: '11px', color: '#aaa' } }, 'AGITATOR RPM'),
                        React.createElement(
                            'div',
                            { style: { fontSize: '20px', color: '#fff', fontWeight: 'bold' } },
                            '1,240 rpm'
                        )
                    )
                )
            )
        ),
        React.createElement(
            'div',
            { className: 'content-panel' },
            React.createElement(
                'div',
                { className: 'section-header' },
                React.createElement('h3', null, React.createElement(Icon, { name: 'policy' }), ' Controls')
            ),
            React.createElement(
                'button',
                { className: 'btn-primary', style: { marginBottom: '15px', width: '100%' } },
                'Initiate Cooling Sequence'
            ),
            React.createElement(
                'button',
                { className: 'btn-secondary', style: { width: '100%' } },
                'Download Audit Log'
            )
        )
    );
};

window.DezincReactors = DezincReactors;
