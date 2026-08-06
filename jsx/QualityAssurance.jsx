const { useState } = React;

const QualityAssurance = ({ viewName, Icon }) => {
    return React.createElement(
        'div',
        { className: 'content-panel' },
        React.createElement(
            'div',
            { className: 'section-header' },
            React.createElement(
                'h3',
                null,
                React.createElement(Icon, { name: 'quality' }),
                ' Laboratory Quality Assurance'
            ),
            React.createElement(
                'button',
                { className: 'bulletin-add-btn' },
                React.createElement(Icon, { name: 'plus' }),
                ' New Sample Log'
            )
        ),
        React.createElement(
            'table',
            { style: { width: '100%', borderCollapse: 'collapse', marginTop: '20px' } },
            React.createElement(
                'thead',
                null,
                React.createElement(
                    'tr',
                    { style: { background: 'var(--bg-panel)', color: 'var(--accent-teal)', fontSize: '12px', textTransform: 'uppercase' } },
                    React.createElement(
                        'th',
                        { style: { padding: '15px', textAlign: 'left', borderRadius: '8px 0 0 8px' } },
                        'Batch ID'
                    ),
                    React.createElement('th', { style: { padding: '15px', textAlign: 'left' } }, 'Time Drawn'),
                    React.createElement('th', { style: { padding: '15px', textAlign: 'left' } }, 'Ni %'),
                    React.createElement('th', { style: { padding: '15px', textAlign: 'left' } }, 'Co %'),
                    React.createElement(
                        'th',
                        { style: { padding: '15px', textAlign: 'left', borderRadius: '0 8px 8px 0' } },
                        'Status'
                    )
                )
            ),
            React.createElement(
                'tbody',
                null,
                ['MS-831', 'MS-832', 'MS-833'].map((batch, i) =>
                    React.createElement(
                        'tr',
                        { key: batch, style: { borderBottom: '1px solid var(--border-light)', fontSize: '13px' } },
                        React.createElement(
                            'td',
                            { style: { padding: '15px', fontWeight: '700', color: 'var(--accent-teal)' } },
                            batch
                        ),
                        React.createElement(
                            'td',
                            { style: { padding: '15px', color: 'var(--text-muted)' } },
                            '08:00 AM'
                        ),
                        React.createElement('td', { style: { padding: '15px', fontWeight: '600' } }, '56.4%'),
                        React.createElement('td', { style: { padding: '15px', fontWeight: '600' } }, '4.2%'),
                        React.createElement(
                            'td',
                            { style: { padding: '15px' } },
                            React.createElement(
                                'span',
                                {
                                    style: {
                                        background: 'rgba(31,170,89,0.1)',
                                        color: '#1FAA59',
                                        padding: '5px 10px',
                                        borderRadius: '20px',
                                        fontSize: '10px',
                                        fontWeight: '800',
                                        textTransform: 'uppercase'
                                    }
                                },
                                'Passed'
                            )
                        )
                    )
                )
            )
        )
    );
};

// Make sure the object name exactly matches the string after removing spaces/special characters
window.QualityAssurance = QualityAssurance;
