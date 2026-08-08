// js/productquality.jsx

(function () {
    const { useState, useEffect, useMemo } = React;

    // Component-specific styles injected safely
    const PQStyles = `
        .pq-grid-layout { display: grid; grid-template-columns: 260px 1fr; gap: clamp(20px, 3vw, 30px); align-items: start; }
        
        /* Sidebar Styles */
        .pq-sidebar { display: flex; flex-direction: column; gap: 8px; }
        .pq-sidebar-item { 
            padding: 14px 18px; border-radius: 8px; border: 1px solid transparent; 
            cursor: pointer; transition: all 0.3s ease; display: flex; align-items: center; justify-content: space-between;
            font-family: var(--font-tech); font-size: 13px; font-weight: 700; color: var(--text-muted); text-transform: uppercase;
        }
        .pq-sidebar-item:hover { background: var(--bg-panel); color: var(--accent-teal); border-color: var(--border-light); transform: translateX(5px); }
        .pq-sidebar-item.active { 
            background: var(--bg-panel); color: var(--accent-pink); border-color: var(--accent-pink);
            box-shadow: 0 4px 15px rgba(255,105,180,0.1); border-left: 4px solid var(--accent-pink);
        }
        .pq-sidebar-count { 
            background: rgba(6,148,148,0.1); color: var(--accent-teal); padding: 2px 8px; 
            border-radius: 12px; font-size: 10px; font-family: var(--font-sans);
        }
        .pq-sidebar-item.active .pq-sidebar-count { background: var(--accent-pink); color: #fff; }

        /* KPI & Timeline Layout */
        .pq-top-dashboard { display: grid; grid-template-columns: 2fr 1fr; gap: 20px; margin-bottom: 25px; }
        
        .pq-kpi-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; }
        .pq-kpi-card { 
            background: var(--bg-base); border: 1px solid var(--border-light); padding: 20px; 
            border-radius: 8px; box-shadow: var(--shadow-soft); position: relative; overflow: hidden;
            display: flex; flex-direction: column; justify-content: center;
        }
        .pq-kpi-card::before { content: ''; position: absolute; left: 0; top: 0; height: 100%; width: 4px; background: var(--accent-cyan); }
        .pq-kpi-card:nth-child(even)::before { background: var(--accent-pink); }
        .pq-kpi-title { font-size: 11px; font-weight: 800; text-transform: uppercase; color: var(--text-muted); margin-bottom: 8px; display: flex; align-items: center; gap: 6px; }
        .pq-kpi-val { font-family: var(--font-tech); font-size: 28px; font-weight: 700; color: var(--accent-teal); line-height: 1; }
        
        /* Timeline */
        .pq-timeline { position: relative; padding-left: 20px; display: flex; flex-direction: column; gap: 15px; max-height: 200px; overflow-y: auto; padding-right: 5px; }
        .pq-timeline::-webkit-scrollbar { width: 4px; }
        .pq-timeline::-webkit-scrollbar-thumb { background: var(--border-panel); border-radius: 4px; }
        .pq-timeline::before { content: ''; position: absolute; left: 5px; top: 5px; bottom: 5px; width: 2px; background: var(--border-light); }
        .pq-timeline-item { position: relative; }
        .pq-timeline-dot { 
            position: absolute; left: -20px; top: 3px; width: 12px; height: 12px; 
            border-radius: 50%; background: var(--bg-base); border: 3px solid var(--accent-pink); 
            box-shadow: 0 0 8px rgba(255,105,180,0.4);
        }
        .pq-timeline-time { font-size: 10px; font-weight: 700; color: var(--accent-cyan); text-transform: uppercase; margin-bottom: 2px; }
        .pq-timeline-text { font-size: 12px; color: var(--text-main); line-height: 1.4; }

        /* Toolbar */
        .pq-toolbar { display: flex; flex-wrap: wrap; gap: 10px; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid var(--border-light); }
        .pq-toolbar-group { display: flex; gap: 10px; align-items: center; }
        .pq-tool-btn { 
            background: var(--bg-base); border: 1px solid var(--border-panel); color: var(--accent-teal); 
            padding: 8px 14px; border-radius: 6px; font-size: 11px; font-weight: 700; text-transform: uppercase; 
            cursor: pointer; transition: 0.3s; display: inline-flex; align-items: center; gap: 6px;
        }
        .pq-tool-btn:hover { background: var(--bg-panel); border-color: var(--accent-teal); color: var(--accent-teal); }
        .pq-tool-btn svg { width: 14px; height: 14px; fill: currentColor; }
        
        /* Data Table */
        .pq-table-wrap { overflow-x: auto; border-radius: 8px; border: 1px solid var(--border-light); }
        .pq-table { width: 100%; border-collapse: collapse; text-align: left; background: #fff; }
        .pq-table th { 
            background: var(--bg-panel); color: var(--accent-teal); font-family: var(--font-tech); 
            font-size: 12px; padding: 14px; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid var(--border-light);
        }
        .pq-table td { padding: 14px; font-size: 12.5px; color: var(--text-main); border-bottom: 1px solid var(--border-light); transition: background 0.2s; }
        .pq-table tr:hover td { background: rgba(6,148,148,0.02); }
        .pq-table tr:last-child td { border-bottom: none; }
        .pq-status-badge { 
            display: inline-block; padding: 4px 10px; border-radius: 20px; font-size: 10px; font-weight: 800; text-transform: uppercase; 
        }
        .status-passed { background: rgba(31,170,89,0.12); color: #1FAA59; }
        .status-pending { background: rgba(242,180,65,0.15); color: #E8871E; }
        .status-rejected { background: rgba(214,41,74,0.15); color: #D6294A; }
        
        .pq-action-cell { display: flex; gap: 6px; }
        .pq-action-btn { 
            width: 26px; height: 26px; border-radius: 6px; border: 1px solid var(--border-panel); 
            background: #fff; display: flex; align-items: center; justify-content: center; 
            cursor: pointer; transition: 0.2s; color: var(--accent-teal);
        }
        .pq-action-btn:hover { background: var(--accent-teal); color: #fff; border-color: var(--accent-teal); }
        .pq-action-btn.danger:hover { background: #e74c3c; color: #fff; border-color: #e74c3c; }
        .pq-action-btn svg { width: 12px; height: 12px; fill: currentColor; }

        @media (max-width: 900px) {
            .pq-grid-layout { grid-template-columns: 1fr; }
            .pq-top-dashboard { grid-template-columns: 1fr; }
        }
    `;

    // Dropdown Categories mapped from Main Navigation
    const QUALITY_AREAS = [
        "Quality Assurance",
        "Quality Reports",
        "Quality Claims",
        "Quality Measures"
    ];

    const DEFAULT_QUALITY_DATA = [
        { id: 'QA-8310', area: 'Quality Assurance', batch: 'MS-831', type: 'Ni Assay', value: '56.4%', status: 'Passed', notes: 'Purity levels nominal.' },
        { id: 'QA-8311', area: 'Quality Assurance', batch: 'MS-832', type: 'Co Assay', value: '4.2%', status: 'Passed', notes: 'Within target range.' },
        { id: 'QA-8312', area: 'Quality Assurance', batch: 'MS-833', type: 'Moisture', value: '32.1%', status: 'Pending', notes: 'Oven drying in progress.' },
        { id: 'QR-1001', area: 'Quality Reports', batch: 'Wk-32 Audit', type: 'Audit Report', value: '98% Score', status: 'Passed', notes: 'ISO 14001 alignment verified.' },
        { id: 'QC-4001', area: 'Quality Claims', batch: 'SHP-99', type: 'Out of Spec', value: 'Zn > 1%', status: 'Rejected', notes: 'Zinc impurities detected post-loading.' },
        { id: 'QM-2001', area: 'Quality Measures', batch: 'CAL-01', type: 'Calibration', value: '0.001 Dev', status: 'Passed', notes: 'Mass spectrometer recalibrated.' },
    ];

    const TIMELINE_EVENTS = {
        "Quality Assurance": [
            { time: "10:15 AM", text: "Batch MS-831 successfully assayed for Nickel." },
            { time: "09:30 AM", text: "New sample batch received from HPAL circuit." },
            { time: "08:00 AM", text: "Lab equipment initialization completed." }
        ],
        "Quality Reports": [
            { time: "11:20 AM", text: "Weekly Quality Audit compiled and submitted." },
            { time: "07:10 AM", text: "Management review initiated for Q3 metrics." }
        ],
        "Quality Claims": [
            { time: "02:05 PM", text: "Claim investigation opened for shipment SHP-99." },
            { time: "09:45 AM", text: "Client feedback received on moisture content." }
        ],
        "Quality Measures": [
            { time: "08:55 AM", text: "Routine calibration for XRF analyzers completed." },
            { time: "06:20 AM", text: "Standard measurement protocols updated." }
        ]
    };

    const emptyForm = { batch: '', type: 'Ni Assay', value: '', status: 'Passed', notes: '' };

    const ProductQualityOverview = ({ viewName, Icon }) => {
        
        // INTERACTIVITY LOGIC: Catch the dropdown clicked from the Navbar
        // If viewName matches one of our categories, set it. Otherwise default to "Quality Assurance"
        const determineInitialArea = () => QUALITY_AREAS.includes(viewName) ? viewName : QUALITY_AREAS[0];
        
        const [activeArea, setActiveArea] = useState(determineInitialArea());
        const [searchQuery, setSearchQuery] = useState("");
        const [dataList, setDataList] = useState(DEFAULT_QUALITY_DATA);
        
        // Modal States
        const [modalMode, setModalMode] = useState(null); 
        const [selectedRecord, setSelectedRecord] = useState(null);
        const [formData, setFormData] = useState(emptyForm);

        // Listen for Navbar changes without reloading the page
        useEffect(() => {
            if (QUALITY_AREAS.includes(viewName)) {
                setActiveArea(viewName);
            } else if (viewName === "PRODUCT QUALITY" || viewName === "PRODUCTQUALITY") {
                setActiveArea(QUALITY_AREAS[0]); // Default if the parent is clicked
            }
        }, [viewName]);

        // Computed Data
        const filteredData = useMemo(() => {
            return dataList.filter(item => 
                item.area === activeArea && 
                (item.batch.toLowerCase().includes(searchQuery.toLowerCase()) || 
                 item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                 item.type.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        }, [dataList, activeArea, searchQuery]);

        // Analytics for KPI Cards
        const kpiStats = useMemo(() => {
            const passed = filteredData.filter(d => d.status === 'Passed').length;
            const rejected = filteredData.filter(d => d.status === 'Rejected').length;
            const pending = filteredData.filter(d => d.status === 'Pending').length;
            const passRate = filteredData.length > 0 ? Math.round((passed / filteredData.length) * 100) : 0;
            return { passed, rejected, pending, passRate };
        }, [filteredData]);

        // UI Helpers
        const getStatusClass = (status) => {
            if(status === 'Passed') return 'status-passed';
            if(status === 'Pending') return 'status-pending';
            return 'status-rejected';
        };

        const triggerToast = (title, sub) => {
            if(window.pushNetToast) {
                window.pushNetToast({ icon: 'check', title, sub });
            } else {
                alert(`${title}: ${sub}`);
            }
        };

        // Toolbar Handlers
        const handleExport = () => triggerToast("QA Data Exported", `Successfully exported ${filteredData.length} records.`);
        const handleImport = () => triggerToast("Import Initiated", "Awaiting file upload confirmation for QA Data.");
        const handleUpload = () => triggerToast("LIMS Sync", "Quality logs pushed to central server.");
        const handleDownload = () => triggerToast("Certificates Downloaded", `Quality Certificates for ${activeArea} downloaded.`);

        // Modal Openers
        const openAdd = () => {
            setFormData(emptyForm);
            setModalMode('add');
        };
        const openEdit = (record) => {
            setSelectedRecord(record);
            setFormData({ batch: record.batch, type: record.type, value: record.value, status: record.status, notes: record.notes });
            setModalMode('edit');
        };
        const openView = (record) => {
            setSelectedRecord(record);
            setModalMode('view');
        };
        const openDelete = (record) => {
            setSelectedRecord(record);
            setModalMode('delete');
        };
        const closeModal = () => {
            setModalMode(null);
            setSelectedRecord(null);
            setFormData(emptyForm);
        };

        // Form Submission
        const handleSave = () => {
            if (!formData.batch || !formData.value) return;
            
            if (modalMode === 'add') {
                const prefix = activeArea.split(' ')[1].substring(0, 2).toUpperCase(); // e.g., 'Quality Assurance' -> 'AS'
                const newRecord = {
                    id: `Q${prefix}-${1000 + Math.floor(Math.random() * 9000)}`,
                    area: activeArea,
                    ...formData
                };
                setDataList([newRecord, ...dataList]);
                triggerToast("Record Added", `${newRecord.batch} Quality Log added to ${activeArea}.`);
            } else if (modalMode === 'edit' && selectedRecord) {
                setDataList(dataList.map(item => item.id === selectedRecord.id ? { ...item, ...formData } : item));
                triggerToast("Record Updated", `${formData.batch} Quality Log modified successfully.`);
            }
            closeModal();
        };

        const handleDelete = () => {
            if(selectedRecord) {
                setDataList(dataList.filter(item => item.id !== selectedRecord.id));
                triggerToast("Record Deleted", `${selectedRecord.batch} has been removed from ${activeArea}.`);
            }
            closeModal();
        };

        return (
            <div className="pq-wrapper">
                <style dangerouslySetInnerHTML={{ __html: PQStyles }} />
                
                <div className="pq-grid-layout">
                    
                    {/* LEFT SIDEBAR - Interactive Dropdown Equivalent */}
                    <div className="content-panel" style={{ padding: '20px' }}>
                        <div className="section-header" style={{ marginBottom: '15px', paddingBottom: '10px' }}>
                            <h3 style={{ fontSize: '15px' }}><Icon name="preparation" /> Product Quality</h3>
                        </div>
                        <div className="pq-sidebar">
                            {QUALITY_AREAS.map(area => {
                                const count = dataList.filter(d => d.area === area).length;
                                return (
                                    <div 
                                        key={area} 
                                        className={`pq-sidebar-item ${activeArea === area ? 'active' : ''}`}
                                        onClick={() => { setActiveArea(area); setSearchQuery(''); }}
                                    >
                                        {area}
                                        <span className="pq-sidebar-count">{count}</span>
                                    </div>
                                )
                            })}
                        </div>
                        <div style={{ marginTop: '20px', padding: '15px', background: 'var(--bg-panel)', borderRadius: '8px', fontSize: '11px', color: 'var(--text-muted)' }}>
                            <strong>Tip:</strong> Selecting an area from the top navigation dropdown will instantly switch your view here.
                        </div>
                    </div>

                    {/* MAIN CONTENT AREA */}
                    <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                        
                        {/* KPI & Timeline */}
                        <div className="pq-top-dashboard">
                            <div className="pq-kpi-grid">
                                <div className="pq-kpi-card">
                                    <div className="pq-kpi-title"><Icon name="bulletin" /> Logged Records</div>
                                    <div className="pq-kpi-val">{filteredData.length}</div>
                                </div>
                                <div className="pq-kpi-card">
                                    <div className="pq-kpi-title"><Icon name="quality" /> Pass Rate</div>
                                    <div className="pq-kpi-val">{kpiStats.passRate}%</div>
                                </div>
                                <div className="pq-kpi-card">
                                    <div className="pq-kpi-title"><Icon name="security" /> Status Summary</div>
                                    <div className="pq-kpi-val" style={{ color: kpiStats.rejected > 0 ? 'var(--accent-pink)' : '#1FAA59', fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        {kpiStats.rejected > 0 ? (
                                            <><Icon name="policy" style={{ width: 20, height: 20 }} /> Issues Found</>
                                        ) : (
                                            <><Icon name="check" style={{ width: 20, height: 20 }} /> All Nominal</>
                                        )}
                                    </div>
                                </div>
                                <div className="pq-kpi-card">
                                    <div className="pq-kpi-title"><Icon name="calendar" /> Pending Checks</div>
                                    <div className="pq-kpi-val" style={{ color: '#E8871E' }}>
                                        {kpiStats.pending}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="content-panel" style={{ padding: '20px' }}>
                                <div className="section-header" style={{ marginBottom: '15px', paddingBottom: '10px' }}>
                                    <h3 style={{ fontSize: '14px' }}><Icon name="calendar" /> {activeArea} Timeline</h3>
                                </div>
                                <div className="pq-timeline">
                                    {(TIMELINE_EVENTS[activeArea] || []).map((ev, i) => (
                                        <div className="pq-timeline-item" key={i}>
                                            <div className="pq-timeline-dot"></div>
                                            <div className="pq-timeline-time">{ev.time}</div>
                                            <div className="pq-timeline-text">{ev.text}</div>
                                        </div>
                                    ))}
                                    {(!TIMELINE_EVENTS[activeArea] || TIMELINE_EVENTS[activeArea].length === 0) && (
                                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>No recent events recorded for {activeArea}.</div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* DATA TABLE PANEL */}
                        <div className="content-panel">
                            <div className="section-header">
                                <h3><Icon name="operations2" /> Quality Logs & Metrics — {activeArea}</h3>
                            </div>

                            {/* Toolbar */}
                            <div className="pq-toolbar">
                                <div className="pq-toolbar-group">
                                    <input 
                                        type="text" 
                                        className="search-all" 
                                        placeholder="Search Batch ID or Type..." 
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        style={{ width: '240px', padding: '9px 14px', fontSize: '12px' }}
                                    />
                                </div>
                                <div className="pq-toolbar-group">
                                    <button className="bulletin-add-btn" onClick={openAdd}>
                                        <Icon name="plus" /> Add Record
                                    </button>
                                    <button className="pq-tool-btn" onClick={handleUpload} title="Upload">
                                        <Icon name="route" /> Upload
                                    </button>
                                    <button className="pq-tool-btn" onClick={handleDownload} title="Download">
                                        <Icon name="area" /> Download
                                    </button>
                                    <button className="pq-tool-btn" onClick={handleImport} title="Import">
                                        <Icon name="recovery" /> Import
                                    </button>
                                    <button className="pq-tool-btn" onClick={handleExport} title="Export">
                                        <Icon name="supply" /> Export
                                    </button>
                                </div>
                            </div>

                            {/* Table */}
                            <div className="pq-table-wrap">
                                <table className="pq-table">
                                    <thead>
                                        <tr>
                                            <th>Log ID</th>
                                            <th>Reference / Batch</th>
                                            <th>Metric / Type</th>
                                            <th>Value / Result</th>
                                            <th>Status</th>
                                            <th style={{ textAlign: 'right' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredData.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>
                                                    No quality records found for this area.
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredData.map(row => (
                                                <tr key={row.id}>
                                                    <td style={{ fontWeight: 700, color: 'var(--accent-teal)' }}>{row.id}</td>
                                                    <td style={{ fontWeight: 600 }}>{row.batch}</td>
                                                    <td>{row.type}</td>
                                                    <td style={{ fontFamily: 'var(--font-tech)', fontWeight: 700 }}>{row.value}</td>
                                                    <td>
                                                        <span className={`pq-status-badge ${getStatusClass(row.status)}`}>
                                                            {row.status}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div className="pq-action-cell" style={{ justifyContent: 'flex-end' }}>
                                                            <button className="pq-action-btn" onClick={() => openView(row)} title="View Details">
                                                                <Icon name="eye" />
                                                            </button>
                                                            <button className="pq-action-btn" onClick={() => openEdit(row)} title="Edit Record">
                                                                <Icon name="edit" />
                                                            </button>
                                                            <button className="pq-action-btn danger" onClick={() => openDelete(row)} title="Delete">
                                                                <Icon name="trash" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* MODALS */}
                
                {/* Add / Edit Modal */}
                <div className={`modal-overlay ${(modalMode === 'add' || modalMode === 'edit') ? 'active' : ''}`} onClick={(e) => { if(e.target.classList.contains('modal-overlay')) closeModal(); }}>
                    <div className="modal-content wide">
                        <button className="modal-close" onClick={closeModal}>×</button>
                        <h3 style={{ fontFamily: 'var(--font-tech)', color: 'var(--accent-teal)', fontSize: '22px', marginBottom: '20px' }}>
                            {modalMode === 'add' ? `Add Record — ${activeArea}` : 'Edit Quality Record'}
                        </h3>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                            <div>
                                <label className="field-label">Reference / Batch No.</label>
                                <input className="field-input" placeholder="e.g. MS-999 or Audit-01" value={formData.batch} onChange={(e) => setFormData({...formData, batch: e.target.value})} />
                            </div>
                            <div>
                                <label className="field-label">Metric / Sample Type</label>
                                <select className="field-select" value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}>
                                    <option value="Ni Assay">Nickel (Ni) Assay</option>
                                    <option value="Co Assay">Cobalt (Co) Assay</option>
                                    <option value="Moisture">Moisture Content</option>
                                    <option value="Impurity">Impurity Profile</option>
                                    <option value="Audit Report">Audit Report</option>
                                    <option value="Out of Spec">Out of Spec Alert</option>
                                    <option value="Calibration">Calibration Log</option>
                                </select>
                            </div>
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '15px' }}>
                            <div>
                                <label className="field-label">Value / Result</label>
                                <input className="field-input" placeholder="e.g. 56.4% or 98% Score" value={formData.value} onChange={(e) => setFormData({...formData, value: e.target.value})} />
                            </div>
                            <div>
                                <label className="field-label">Process Status</label>
                                <select className="field-select" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                                    <option value="Passed">Passed / Nominal</option>
                                    <option value="Pending">Pending / In Testing</option>
                                    <option value="Rejected">Rejected / Alert</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ marginTop: '15px' }}>
                            <label className="field-label">Analysis Notes</label>
                            <textarea className="field-textarea" placeholder="Remarks regarding this quality check..." value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})}></textarea>
                        </div>

                        <div className="modal-btn-row">
                            <button className="btn-secondary" onClick={closeModal}>Cancel</button>
                            <button className="btn-primary" style={{ width: 'auto', flex: 1 }} onClick={handleSave} disabled={!formData.batch || !formData.value}>
                                {modalMode === 'add' ? 'Save Record' : 'Update Log'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* View Modal */}
                <div className={`modal-overlay ${modalMode === 'view' ? 'active' : ''}`} onClick={(e) => { if(e.target.classList.contains('modal-overlay')) closeModal(); }}>
                    <div className="modal-content">
                        <button className="modal-close" onClick={closeModal}>×</button>
                        {selectedRecord && (
                            <React.Fragment>
                                <div className="modal-view-tag">{activeArea} — Log Profile</div>
                                <h3 style={{ fontFamily: 'var(--font-tech)', color: 'var(--accent-teal)', fontSize: '21px' }}>{selectedRecord.id} <br/><span style={{fontSize: '14px', color: 'var(--text-muted)'}}>Ref: {selectedRecord.batch}</span></h3>
                                
                                <div style={{ margin: '20px 0', background: 'var(--bg-panel)', padding: '15px', borderRadius: '8px', borderLeft: '4px solid var(--accent-pink)' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', fontSize: '13px' }}>
                                        <div><strong>Category:</strong> <br/>{selectedRecord.area}</div>
                                        <div><strong>Metric Type:</strong> <br/>{selectedRecord.type}</div>
                                        <div><strong>Value/Result:</strong> <br/>{selectedRecord.value}</div>
                                        <div><strong>Current Status:</strong> <br/><span className={`pq-status-badge ${getStatusClass(selectedRecord.status)}`}>{selectedRecord.status}</span></div>
                                    </div>
                                </div>

                                <h5 style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--accent-teal)', marginBottom: '5px' }}>Analysis Notes</h5>
                                <p className="modal-view-desc" style={{ marginTop: 0 }}>{selectedRecord.notes || 'No remarks added by the laboratory.'}</p>
                                
                                <div className="modal-btn-row">
                                    <button className="btn-primary" style={{ width: '100%' }} onClick={closeModal}>Acknowledge & Close</button>
                                </div>
                            </React.Fragment>
                        )}
                    </div>
                </div>

                {/* Delete Confirmation Modal */}
                <div className={`modal-overlay ${modalMode === 'delete' ? 'active' : ''}`} onClick={(e) => { if(e.target.classList.contains('modal-overlay')) closeModal(); }}>
                    <div className="modal-content">
                        <button className="modal-close" onClick={closeModal}>×</button>
                        <h3 style={{ fontFamily: 'var(--font-tech)', color: 'var(--accent-teal)', marginBottom: '15px', fontSize: '22px' }}>Delete Quality Log</h3>
                        <p style={{ fontSize: '13px', marginBottom: '20px', opacity: 0.85 }}>
                            Are you certain you wish to delete log <strong>{selectedRecord?.batch}</strong> from <strong>{activeArea}</strong>? This action is permanent and will be recorded in the audit trail.
                        </p>
                        <div className="modal-btn-row">
                            <button className="btn-secondary" onClick={closeModal}>Cancel</button>
                            <button className="btn-primary" style={{ width: 'auto', flex: 1, background: '#e74c3c' }} onClick={handleDelete}>Delete Log</button>
                        </div>
                    </div>
                </div>

            </div>
        );
    };

    // Attach component to window dynamically for all PRODUCT QUALITY Sub-Menus
    // This maps the main navbar parent AND all its children to this UI.
    window.PRODUCTQUALITY = ProductQualityOverview; // Replaces spaces via the router's strip mechanism
    window.QualityAssurance = ProductQualityOverview;
    window.QualityReports = ProductQualityOverview;
    window.QualityClaims = ProductQualityOverview;
    window.QualityMeasures = ProductQualityOverview;

})();