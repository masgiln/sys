const { useState, useEffect } = React;

const GenericPage = ({ viewName, Icon }) => {
    return React.createElement(
        'div',
        { className: 'content-panel', style: { padding: '40px' } },
        React.createElement(
            'div',
            { className: 'section-header' },
            React.createElement(
                'h3',
                null,
                React.createElement(Icon, { name: 'operations' }),
                ' ',
                viewName,
                ' Overview'
            )
        ),
        React.createElement(
            'p',
            { style: { color: 'var(--text-muted)', marginBottom: '30px' } },
            'This is the operational dashboard for ',
            React.createElement('strong', null, viewName),
            '. Live telemetry, maintenance logs, and historical data will populate here.'
        ),
        React.createElement(
            'div',
            { className: 'mvg-grid', style: { marginBottom: '40px' } },
            React.createElement(
                'div',
                { className: 'mvg-card' },
                React.createElement(Icon, { name: 'quality', style: { fill: 'var(--accent-teal)' } }),
                React.createElement('h4', null, 'System Status'),
                React.createElement(
                    'p',
                    { style: { fontSize: '24px', fontWeight: '800', color: '#1FAA59', marginTop: '10px' } },
                    'ONLINE'
                ),
                React.createElement(
                    'p',
                    { style: { fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' } },
                    'All parameters nominal'
                )
            ),
            React.createElement(
                'div',
                { className: 'mvg-card' },
                React.createElement(Icon, { name: 'recovery', style: { fill: 'var(--accent-pink)' } }),
                React.createElement('h4', null, 'Process Yield'),
                React.createElement(
                    'p',
                    { style: { fontSize: '24px', fontWeight: '800', color: 'var(--accent-pink)', marginTop: '10px' } },
                    '98.4%'
                ),
                React.createElement(
                    'p',
                    { style: { fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' } },
                    'Last 24 Hours'
                )
            ),
            React.createElement(
                'div',
                { className: 'mvg-card' },
                React.createElement(Icon, { name: 'policy', style: { fill: 'var(--accent-cyan)' } }),
                React.createElement('h4', null, 'Open Issues'),
                React.createElement(
                    'p',
                    { style: { fontSize: '24px', fontWeight: '800', color: 'var(--text-main)', marginTop: '10px' } },
                    '0'
                ),
                React.createElement(
                    'p',
                    { style: { fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' } },
                    'Requires Attention'
                )
            )
        ),
        React.createElement(
            'div',
            { className: 'section-header' },
            React.createElement(
                'h3',
                { style: { fontSize: '16px' } },
                React.createElement(Icon, { name: 'calendar' }),
                ' Recent Activity Log'
            )
        ),
        React.createElement(
            'div',
            {
                style: {
                    background: 'var(--bg-base)',
                    border: '1px solid var(--border-light)',
                    borderRadius: '8px',
                    overflow: 'hidden'
                }
            },
            [1, 2, 3].map((i) =>
                React.createElement(
                    'div',
                    {
                        key: i,
                        style: {
                            display: 'flex',
                            padding: '15px 20px',
                            borderBottom: i !== 3 ? '1px solid var(--border-light)' : 'none',
                            alignItems: 'center',
                            gap: '15px'
                        }
                    },
                    React.createElement(
                        'div',
                        {
                            style: {
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                background: 'var(--bg-panel)',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                color: 'var(--accent-teal)'
                            }
                        },
                        React.createElement(Icon, { name: 'check', style: { width: '20px', height: '20px' } })
                    ),
                    React.createElement(
                        'div',
                        { style: { flex: 1 } },
                        React.createElement(
                            'div',
                            { style: { fontSize: '13px', fontWeight: '700', color: 'var(--accent-teal)' } },
                            'Automated Diagnostic Passed'
                        ),
                        React.createElement(
                            'div',
                            { style: { fontSize: '11px', color: 'var(--text-muted)' } },
                            'Routine system check completed for ' + viewName + '.'
                        )
                    ),
                    React.createElement(
                        'div',
                        { style: { fontSize: '11px', fontWeight: '600', color: 'var(--accent-pink)' } },
                        'Just now'
                    )
                )
            )
        )
    );
};

// Assign to window to make it accessible to index.html routing
window.GenericPage = GenericPage;
