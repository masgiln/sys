// js/msarea.jsx

(function () {
    const { useState, useEffect, useMemo } = React;

    // Component-specific styles injected safely
    const MSAreasStyles = `
        .ms-grid-layout { display: grid; grid-template-columns: 260px 1fr; gap: clamp(20px, 3vw, 30px); align-items: start; }
        
        /* Sidebar Styles */
        .ms-sidebar { display: flex; flex-direction: column; gap: 8px; }
        .ms-sidebar-item { 
            padding: 14px 18px; border-radius: 8px; border: 1px solid transparent; 
            cursor: pointer; transition: all 0.3s ease; display: flex; align-items: center; justify-content: space-between;
            font-family: var(--font-tech); font-size: 13px; font-weight: 700; color: var(--text-muted); text-transform: uppercase;
        }
        .ms-sidebar-item:hover { background: var(--bg-panel); color: var(--accent-teal); border-color: var(--border-light); transform: translateX(5px); }
        .ms-sidebar-item.active { 
            background: var(--bg-panel); color: var(--accent-pink); border-color: var(--accent-pink);
            box-shadow: 0 4px 15px rgba(255,105,180,0.1); border-left: 4px solid var(--accent-pink);
        }
        .ms-sidebar-count { 
            background: rgba(6,148,148,0.1); color: var(--accent-teal); padding: 2px 8px; 
            border-radius: 12px; font-size: 10px; font-family: var(--font-sans);
        }
        .ms-sidebar-item.active .ms-sidebar-count { background: var(--accent-pink); color: #fff; }

        /* Sub-Unit Navigation Bar (UL/LI Dropdown Sync) */
        .ms-subunit-bar {
            display: flex; flex-wrap: wrap; gap: 8px; align-items: center;
            background: var(--bg-panel); border: 1px solid var(--border-light);
            padding: 12px 16px; border-radius: 10px; margin-bottom: 20px;
        }
        .ms-subunit-label {
            font-family: var(--font-tech); font-size: 11px; font-weight: 800; color: var(--accent-teal);
            text-transform: uppercase; letter-spacing: 0.8px; margin-right: 6px; display: flex; align-items: center; gap: 6px;
        }
        .ms-subunit-label svg { width: 15px; height: 15px; fill: var(--accent-pink); }
        .ms-subunit-pill {
            background: #FFFFFF; border: 1px solid var(--border-panel); color: var(--text-main);
            padding: 6px 14px; border-radius: 20px; font-size: 11px; font-weight: 700;
            text-transform: uppercase; cursor: pointer; transition: 0.25s ease;
        }
        .ms-subunit-pill:hover { border-color: var(--accent-teal); color: var(--accent-teal); transform: translateY(-1px); }
        .ms-subunit-pill.active {
            background: var(--accent-teal); color: #FFFFFF; border-color: var(--accent-teal);
            box-shadow: 0 3px 10px rgba(6,148,148,0.25);
        }

        /* KPI & Timeline Layout */
        .ms-top-dashboard { display: grid; grid-template-columns: 2fr 1fr; gap: 20px; margin-bottom: 25px; }
        
        .ms-kpi-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; }
        .ms-kpi-card { 
            background: var(--bg-base); border: 1px solid var(--border-light); padding: 20px; 
            border-radius: 8px; box-shadow: var(--shadow-soft); position: relative; overflow: hidden;
        }
        .ms-kpi-card::before { content: ''; position: absolute; left: 0; top: 0; height: 100%; width: 4px; background: var(--accent-cyan); }
        .ms-kpi-card:nth-child(even)::before { background: var(--accent-pink); }
        .ms-kpi-title { font-size: 11px; font-weight: 800; text-transform: uppercase; color: var(--text-muted); margin-bottom: 8px; }
        .ms-kpi-val { font-family: var(--font-tech); font-size: 28px; font-weight: 700; color: var(--accent-teal); line-height: 1; }
        
        /* Timeline */
        .ms-timeline { position: relative; padding-left: 20px; display: flex; flex-direction: column; gap: 15px; }
        .ms-timeline::before { content: ''; position: absolute; left: 5px; top: 5px; bottom: 5px; width: 2px; background: var(--border-light); }
        .ms-timeline-item { position: relative; }
        .ms-timeline-dot { 
            position: absolute; left: -20px; top: 3px; width: 12px; height: 12px; 
            border-radius: 50%; background: var(--bg-base); border: 3px solid var(--accent-pink); 
            box-shadow: 0 0 8px rgba(255,105,180,0.4);
        }
        .ms-timeline-time { font-size: 10px; font-weight: 700; color: var(--accent-cyan); text-transform: uppercase; margin-bottom: 2px; }
        .ms-timeline-text { font-size: 12px; color: var(--text-main); line-height: 1.4; }

        /* Toolbar */
        .ms-toolbar { display: flex; flex-wrap: wrap; gap: 10px; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid var(--border-light); }
        .ms-toolbar-group { display: flex; gap: 10px; align-items: center; }
        .ms-tool-btn { 
            background: var(--bg-base); border: 1px solid var(--border-panel); color: var(--accent-teal); 
            padding: 8px 14px; border-radius: 6px; font-size: 11px; font-weight: 700; text-transform: uppercase; 
            cursor: pointer; transition: 0.3s; display: inline-flex; align-items: center; gap: 6px;
        }
        .ms-tool-btn:hover { background: var(--bg-panel); border-color: var(--accent-teal); color: var(--accent-teal); }
        .ms-tool-btn svg { width: 14px; height: 14px; fill: currentColor; }
        
        /* Data Table */
        .ms-table-wrap { overflow-x: auto; border-radius: 8px; border: 1px solid var(--border-light); }
        .ms-table { width: 100%; border-collapse: collapse; text-align: left; background: #fff; }
        .ms-table th { 
            background: var(--bg-panel); color: var(--accent-teal); font-family: var(--font-tech); 
            font-size: 12px; padding: 14px; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid var(--border-light);
        }
        .ms-table td { padding: 14px; font-size: 12.5px; color: var(--text-main); border-bottom: 1px solid var(--border-light); transition: background 0.2s; }
        .ms-table tr:hover td { background: rgba(6,148,148,0.02); }
        .ms-table tr:last-child td { border-bottom: none; }
        .ms-status-badge { 
            display: inline-block; padding: 4px 10px; border-radius: 20px; font-size: 10px; font-weight: 800; text-transform: uppercase; 
        }
        .status-optimal { background: rgba(31,170,89,0.12); color: #1FAA59; }
        .status-pending { background: rgba(242,180,65,0.15); color: #E8871E; }
        .status-critical { background: rgba(214,41,74,0.15); color: #D6294A; }
        
        .ms-action-cell { display: flex; gap: 6px; }
        .ms-action-btn { 
            width: 26px; height: 26px; border-radius: 6px; border: 1px solid var(--border-panel); 
            background: #fff; display: flex; align-items: center; justify-content: center; 
            cursor: pointer; transition: 0.2s; color: var(--accent-teal);
        }
        .ms-action-btn:hover { background: var(--accent-teal); color: #fff; border-color: var(--accent-teal); }
        .ms-action-btn.danger:hover { background: #e74c3c; color: #fff; border-color: #e74c3c; }
        .ms-action-btn svg { width: 12px; height: 12px; fill: currentColor; }

        @media (max-width: 900px) {
            .ms-grid-layout { grid-template-columns: 1fr; }
            .ms-top-dashboard { grid-template-columns: 1fr; }
        }
    `;

    // Complete mapping of Parent Areas to Sub-Unit Dropdown Links from NAV_DATA
    const AREA_HIERARCHY = {
        "Dezinc Area's (105)": ["All Units", "Dezinc Reactors", "105TK05", "Polishing Filters A-F", "105TK13", "105TK08"],
        "MS Area's (106)": ["All Units", "106TK01", "MS MS Reators", "106TK08", "Vacuum & Compressor", "Thickener", "106TK14"],
        "H2S Area's": ["All Units", "Sulfur Area", "H2 Area", "Methanol Area", "Scrubbers Area", "N2 Gen Area"],
        "F - Neut Area's": ["All Units", "Extraction Circuit", "Refining Phase"],
        "Limestone Area": ["All Units", "Gas Treatment", "Emissions Logging"]
    };

    const SUB_AREAS = Object.keys(AREA_HIERARCHY);

    // Resolves any viewName clicked in the header UL/LI menu to its Parent Area & Sub-Unit
    const resolveAreaSelection = (viewName) => {
        if (!viewName || viewName === "MS Area's") {
            return { area: "Dezinc Area's (105)", subUnit: "All Units" };
        }
        if (AREA_HIERARCHY[viewName]) {
            return { area: viewName, subUnit: "All Units" };
        }
        for (const [parentArea, units] of Object.entries(AREA_HIERARCHY)) {
            if (units.includes(viewName)) {
                return { area: parentArea, subUnit: viewName };
            }
        }
        return { area: "Dezinc Area's (105)", subUnit: "All Units" };
    };

    // Realistic Crude Data tagged by Area and Specific Sub-Unit
    const DEFAULT_CRUDE_DATA = [
        { id: 'CRD-1001', area: "Dezinc Area's (105)", unit: 'Dezinc Reactors', batch: 'DZ-A01', type: 'Limonite', volume: '1,450', status: 'Optimal', notes: 'Standard extraction.' },
        { id: 'CRD-1002', area: "Dezinc Area's (105)", unit: '105TK05', batch: 'DZ-A02', type: 'Mixed', volume: '980', status: 'Pending', notes: 'Awaiting assay results.' },
        { id: 'CRD-1003', area: "Dezinc Area's (105)", unit: 'Polishing Filters A-F', batch: 'DZ-A03', type: 'Limonite', volume: '1,120', status: 'Optimal', notes: 'Polishing filter lines nominal.' },
        { id: 'CRD-1004', area: "MS Area's (106)", unit: '106TK01', batch: 'MS-B11', type: 'Saprolite', volume: '2,100', status: 'Optimal', notes: 'High purity batch.' },
        { id: 'CRD-1005', area: "MS Area's (106)", unit: 'Thickener', batch: 'MS-B12', type: 'Saprolite', volume: '3,400', status: 'Optimal', notes: 'Thickener overflow rate balanced.' },
        { id: 'CRD-1006', area: "MS Area's (106)", unit: 'Vacuum & Compressor', batch: 'MS-B13', type: 'Mixed', volume: '1,850', status: 'Pending', notes: 'Compressor check in progress.' },
        { id: 'CRD-1007', area: "H2S Area's", unit: 'Sulfur Area', batch: 'HS-X9', type: 'Limonite', volume: '600', status: 'Critical', notes: 'Pressure anomaly detected.' },
        { id: 'CRD-1008', area: "H2S Area's", unit: 'Scrubbers Area', batch: 'HS-X10', type: 'Reagent', volume: '1,300', status: 'Optimal', notes: 'Scrubber pH recalibrated.' },
        { id: 'CRD-1009', area: "F - Neut Area's", unit: 'Extraction Circuit', batch: 'FN-01', type: 'Residue', volume: '3,200', status: 'Optimal', notes: 'Neutralization complete.' },
        { id: 'CRD-1010', area: "F - Neut Area's", unit: 'Refining Phase', batch: 'FN-02', type: 'Residue', volume: '2,900', status: 'Optimal', notes: 'Refining distillation active.' },
        { id: 'CRD-1011', area: "Limestone Area", unit: 'Gas Treatment', batch: 'LM-44', type: 'Reagent', volume: '4,500', status: 'Optimal', notes: 'Feed lines clear.' },
        { id: 'CRD-1012', area: "Limestone Area", unit: 'Emissions Logging', batch: 'LM-45', type: 'Reagent', volume: '2,200', status: 'Optimal', notes: 'Zero emissions spike logged.' }
    ];

    const TIMELINE_EVENTS = {
        "Dezinc Area's (105)": [
            { time: "08:15 AM", unit: "Dezinc Reactors", text: "Batch DZ-A01 successfully processed." },
            { time: "07:30 AM", unit: "Polishing Filters A-F", text: "Filter polishing lines A-F cleaned." },
            { time: "06:00 AM", unit: "105TK05", text: "Shift handover completed safely." }
        ],
        "MS Area's (106)": [
            { time: "08:20 AM", unit: "Thickener", text: "Thickener overflow rate normalized." },
            { time: "07:10 AM", unit: "Vacuum & Compressor", text: "Vacuum compressor routine diagnostic." }
        ],
        "H2S Area's": [
            { time: "08:05 AM", unit: "Scrubbers Area", text: "Scrubber area pH recalibrated." },
            { time: "06:45 AM", unit: "Methanol Area", text: "Methanol feed rate increased by 2%." }
        ],
        "F - Neut Area's": [
            { time: "07:55 AM", unit: "Extraction Circuit", text: "Extraction circuit bypassed for maintenance." },
            { time: "06:20 AM", unit: "Refining Phase", text: "Refining phase initialized." }
        ],
        "Limestone Area": [
            { time: "08:10 AM", unit: "Gas Treatment", text: "Gas treatment logging recorded zero anomalies." },
            { time: "05:30 AM", unit: "Emissions Logging", text: "Silo #2 reloaded with 5,000 tons." }
        ]
    };

    const emptyForm = { batch: '', unit: '', type: 'Limonite', volume: '', status: 'Optimal', notes: '' };

    const MSAreas = ({ viewName, Icon }) => {
        // Automatically sync initial state with whatever UL/LI dropdown item was clicked
        const initialSelection = resolveAreaSelection(viewName);
        const [activeArea, setActiveArea] = useState(initialSelection.area);
        const [activeSubUnit, setActiveSubUnit] = useState(initialSelection.subUnit);
        const [searchQuery, setSearchQuery] = useState("");
        const [dataList, setDataList] = useState(DEFAULT_CRUDE_DATA);
        
        // Modal States
        const [modalMode, setModalMode] = useState(null); // 'add', 'edit', 'view', 'delete'
        const [selectedRecord, setSelectedRecord] = useState(null);
        const [formData, setFormData] = useState(emptyForm);

        // React when user clicks a different UL/LI item in the header while MSAreas is already open
        useEffect(() => {
            const resolved = resolveAreaSelection(viewName);
            setActiveArea(resolved.area);
            setActiveSubUnit(resolved.subUnit);
            setSearchQuery("");
        }, [viewName]);

        // Filtered Data based on Sidebar Selection, Sub-Unit selection, and Search query
        const filteredData = useMemo(() => {
            return dataList.filter(item => {
                const matchArea = item.area === activeArea;
                const matchSubUnit = activeSubUnit === "All Units" || item.unit === activeSubUnit;
                const matchSearch = item.batch.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                    item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                    item.unit.toLowerCase().includes(searchQuery.toLowerCase());
                return matchArea && matchSubUnit && matchSearch;
            });
        }, [dataList, activeArea, activeSubUnit, searchQuery]);

        // Filtered timeline events by Area and Sub-Unit
        const filteredTimeline = useMemo(() => {
            const events = TIMELINE_EVENTS[activeArea] || [];
            if (activeSubUnit === "All Units") return events;
            return events.filter(ev => ev.unit === activeSubUnit);
        }, [activeArea, activeSubUnit]);

        // Helpers
        const getStatusClass = (status) => {
            if(status === 'Optimal') return 'status-optimal';
            if(status === 'Pending') return 'status-pending';
            return 'status-critical';
        };

        const triggerToast = (title, sub) => {
            if(window.pushNetToast) {
                window.pushNetToast({ icon: 'check', title, sub });
            } else {
                alert(`${title}: ${sub}`);
            }
        };

        // Handlers for Toolbar
        const handleExport = () => triggerToast("Data Exported", `Successfully exported ${filteredData.length} records to CSV.`);
        const handleImport = () => triggerToast("Import Initiated", "Awaiting file upload confirmation.");
        const handleUpload = () => triggerToast("Upload Sync", "Local data pushed to central server.");
        const handleDownload = () => triggerToast("Manual Downloaded", "Area specifications downloaded.");

        // CRUD Modals Openers
        const openAdd = () => {
            const availableUnits = AREA_HIERARCHY[activeArea].filter(u => u !== "All Units");
            setFormData({
                ...emptyForm,
                unit: activeSubUnit !== "All Units" ? activeSubUnit : (availableUnits[0] || "General")
            });
            setModalMode('add');
        };
        const openEdit = (record) => {
            setSelectedRecord(record);
            setFormData({ batch: record.batch, unit: record.unit, type: record.type, volume: record.volume, status: record.status, notes: record.notes });
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

        // CRUD Actions
        const handleSave = () => {
            if (!formData.batch || !formData.volume) return;
            
            if (modalMode === 'add') {
                const newRecord = {
                    id: `CRD-${1000 + dataList.length + 1}`,
                    area: activeArea,
                    ...formData
                };
                setDataList([newRecord, ...dataList]);
                triggerToast("Record Added", `${newRecord.batch} added to ${formData.unit}.`);
            } else if (modalMode === 'edit' && selectedRecord) {
                setDataList(dataList.map(item => item.id === selectedRecord.id ? { ...item, ...formData } : item));
                triggerToast("Record Updated", `${formData.batch} updated successfully.`);
            }
            closeModal();
        };

        const handleDelete = () => {
            if(selectedRecord) {
                setDataList(dataList.filter(item => item.id !== selectedRecord.id));
                triggerToast("Record Deleted", `${selectedRecord.batch} has been removed.`);
            }
            closeModal();
        };

        return (
            <div className="ms-area-wrapper">
                <style dangerouslySetInnerHTML={{ __html: MSAreasStyles }} />
                
                <div className="ms-grid-layout">
                    
                    {/* LEFT SIDEBAR */}
                    <div className="content-panel" style={{ padding: '20px' }}>
                        <div className="section-header" style={{ marginBottom: '15px', paddingBottom: '10px' }}>
                            <h3 style={{ fontSize: '15px' }}><Icon name="operations2" /> Sector Selection</h3>
                        </div>
                        <div className="ms-sidebar">
                            {SUB_AREAS.map(area => {
                                const count = dataList.filter(d => d.area === area).length;
                                return (
                                    <div 
                                        key={area} 
                                        className={`ms-sidebar-item ${activeArea === area ? 'active' : ''}`}
                                        onClick={() => { 
                                            setActiveArea(area); 
                                            setActiveSubUnit("All Units");
                                            setSearchQuery(''); 
                                        }}
                                    >
                                        {area}
                                        <span className="ms-sidebar-count">{count}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* MAIN CONTENT AREA */}
                    <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                        
                        {/* INTERACTIVE SUB-UNIT BAR (Syncs with UL/LI dropdown items) */}
                        <div className="ms-subunit-bar">
                            <div className="ms-subunit-label">
                                <Icon name="operations" /> {activeArea}:
                            </div>
                            {(AREA_HIERARCHY[activeArea] || []).map(unit => (
                                <button
                                    key={unit}
                                    type="button"
                                    className={`ms-subunit-pill ${activeSubUnit === unit ? 'active' : ''}`}
                                    onClick={() => setActiveSubUnit(unit)}
                                >
                                    {unit}
                                </button>
                            ))}
                        </div>

                        {/* KPI & Timeline */}
                        <div className="ms-top-dashboard">
                            <div className="ms-kpi-grid">
                                <div className="ms-kpi-card">
                                    <div className="ms-kpi-title">Active Batches</div>
                                    <div className="ms-kpi-val">{filteredData.length}</div>
                                </div>
                                <div className="ms-kpi-card">
                                    <div className="ms-kpi-title">Total Volume (m³)</div>
                                    <div className="ms-kpi-val">
                                        {filteredData.reduce((sum, item) => sum + parseInt(item.volume.replace(/,/g, '') || 0), 0).toLocaleString()}
                                    </div>
                                </div>
                                <div className="ms-kpi-card">
                                    <div className="ms-kpi-title">Area Status</div>
                                    <div className="ms-kpi-val" style={{ color: '#1FAA59', fontSize: '22px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Icon name="check" style={{ width: 22, height: 22 }} /> Nominal
                                    </div>
                                </div>
                                <div className="ms-kpi-card">
                                    <div className="ms-kpi-title">Critical Alerts</div>
                                    <div className="ms-kpi-val" style={{ color: 'var(--accent-pink)' }}>
                                        {filteredData.filter(d => d.status === 'Critical').length}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="content-panel" style={{ padding: '20px' }}>
                                <div className="section-header" style={{ marginBottom: '15px', paddingBottom: '10px' }}>
                                    <h3 style={{ fontSize: '14px' }}><Icon name="calendar" /> {activeSubUnit} Timeline</h3>
                                </div>
                                <div className="ms-timeline">
                                    {filteredTimeline.length === 0 ? (
                                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', padding: '10px 0' }}>
                                            No recent activity logged for {activeSubUnit}.
                                        </div>
                                    ) : (
                                        filteredTimeline.map((ev, i) => (
                                            <div className="ms-timeline-item" key={i}>
                                                <div className="ms-timeline-dot"></div>
                                                <div className="ms-timeline-time">{ev.time} — {ev.unit}</div>
                                                <div className="ms-timeline-text">{ev.text}</div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* DATA TABLE PANEL */}
                        <div className="content-panel">
                            <div className="section-header">
                                <h3>
                                    <Icon name="policy" /> Crude Data Logs — {activeArea} 
                                    {activeSubUnit !== "All Units" && <span style={{ color: 'var(--accent-pink)' }}> [{activeSubUnit}]</span>}
                                </h3>
                            </div>

                            {/* Toolbar */}
                            <div className="ms-toolbar">
                                <div className="ms-toolbar-group">
                                    <input 
                                        type="text" 
                                        className="search-all" 
                                        placeholder="Search Batch ID, Unit..." 
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        style={{ width: '220px', padding: '8px 14px', fontSize: '12px' }}
                                    />
                                </div>
                                <div className="ms-toolbar-group">
                                    <button className="bulletin-add-btn" onClick={openAdd}>
                                        <Icon name="plus" /> Add Crude
                                    </button>
                                    <button className="ms-tool-btn" onClick={handleUpload} title="Upload">
                                        <Icon name="route" /> Upload
                                    </button>
                                    <button className="ms-tool-btn" onClick={handleDownload} title="Download">
                                        <Icon name="area" /> Download
                                    </button>
                                    <button className="ms-tool-btn" onClick={handleImport} title="Import">
                                        <Icon name="recovery" /> Import
                                    </button>
                                    <button className="ms-tool-btn" onClick={handleExport} title="Export">
                                        <Icon name="supply" /> Export
                                    </button>
                                </div>
                            </div>

                            {/* Table */}
                            <div className="ms-table-wrap">
                                <table className="ms-table">
                                    <thead>
                                        <tr>
                                            <th>Log ID</th>
                                            <th>Sub-Unit</th>
                                            <th>Batch Number</th>
                                            <th>Crude Type</th>
                                            <th>Volume (m³)</th>
                                            <th>Status</th>
                                            <th style={{ textAlign: 'right' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredData.length === 0 ? (
                                            <tr>
                                                <td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '30px' }}>
                                                    No crude records found for {activeSubUnit} in this area.
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredData.map(row => (
                                                <tr key={row.id}>
                                                    <td style={{ fontWeight: 700, color: 'var(--accent-teal)' }}>{row.id}</td>
                                                    <td style={{ fontWeight: 600, color: 'var(--text-muted)' }}>{row.unit}</td>
                                                    <td style={{ fontWeight: 600 }}>{row.batch}</td>
                                                    <td>{row.type}</td>
                                                    <td style={{ fontFamily: 'var(--font-tech)', fontWeight: 700 }}>{row.volume}</td>
                                                    <td>
                                                        <span className={`ms-status-badge ${getStatusClass(row.status)}`}>
                                                            {row.status}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div className="ms-action-cell" style={{ justifyContent: 'flex-end' }}>
                                                            <button className="ms-action-btn" onClick={() => openView(row)} title="View Details">
                                                                <Icon name="eye" />
                                                            </button>
                                                            <button className="ms-action-btn" onClick={() => openEdit(row)} title="Edit">
                                                                <Icon name="edit" />
                                                            </button>
                                                            <button className="ms-action-btn danger" onClick={() => openDelete(row)} title="Delete">
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
                            {modalMode === 'add' ? `Add Crude Data — ${activeArea}` : 'Edit Crude Record'}
                        </h3>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                            <div>
                                <label className="field-label">Batch Number</label>
                                <input className="field-input" placeholder="e.g. DZ-A01" value={formData.batch} onChange={(e) => setFormData({...formData, batch: e.target.value})} />
                            </div>
                            <div>
                                <label className="field-label">Sub-Unit / Equipment</label>
                                <select className="field-select" value={formData.unit} onChange={(e) => setFormData({...formData, unit: e.target.value})}>
                                    {(AREA_HIERARCHY[activeArea] || []).filter(u => u !== "All Units").map(u => (
                                        <option key={u} value={u}>{u}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '15px' }}>
                            <div>
                                <label className="field-label">Crude Type</label>
                                <select className="field-select" value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}>
                                    <option value="Limonite">Limonite</option>
                                    <option value="Saprolite">Saprolite</option>
                                    <option value="Mixed">Mixed</option>
                                    <option value="Residue">Residue</option>
                                    <option value="Reagent">Reagent</option>
                                </select>
                            </div>
                            <div>
                                <label className="field-label">Volume (m³)</label>
                                <input className="field-input" placeholder="e.g. 1,450" value={formData.volume} onChange={(e) => setFormData({...formData, volume: e.target.value})} />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '15px' }}>
                            <div>
                                <label className="field-label">Process Status</label>
                                <select className="field-select" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                                    <option value="Optimal">Optimal</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Critical">Critical</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ marginTop: '15px' }}>
                            <label className="field-label">Operational Notes</label>
                            <textarea className="field-textarea" placeholder="Remarks regarding this crude batch..." value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})}></textarea>
                        </div>

                        <div className="modal-btn-row">
                            <button className="btn-secondary" onClick={closeModal}>Cancel</button>
                            <button className="btn-primary" style={{ width: 'auto', flex: 1 }} onClick={handleSave} disabled={!formData.batch || !formData.volume}>
                                {modalMode === 'add' ? 'Save Record' : 'Update Record'}
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
                                <div className="modal-view-tag">Crude Data Log</div>
                                <h3 style={{ fontFamily: 'var(--font-tech)', color: 'var(--accent-teal)', fontSize: '21px' }}>{selectedRecord.id} — {selectedRecord.batch}</h3>
                                
                                <div style={{ margin: '20px 0', background: 'var(--bg-panel)', padding: '15px', borderRadius: '8px', borderLeft: '4px solid var(--accent-cyan)' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '13px' }}>
                                        <div><strong>Area:</strong> <br/>{selectedRecord.area}</div>
                                        <div><strong>Sub-Unit:</strong> <br/>{selectedRecord.unit}</div>
                                        <div><strong>Type:</strong> <br/>{selectedRecord.type}</div>
                                        <div><strong>Volume:</strong> <br/>{selectedRecord.volume} m³</div>
                                        <div style={{ gridColumn: '1 / -1' }}><strong>Status:</strong> <br/><span className={`ms-status-badge ${getStatusClass(selectedRecord.status)}`}>{selectedRecord.status}</span></div>
                                    </div>
                                </div>

                                <h5 style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--accent-teal)', marginBottom: '5px' }}>Operational Notes</h5>
                                <p className="modal-view-desc" style={{ marginTop: 0 }}>{selectedRecord.notes || 'No additional notes provided.'}</p>
                                
                                <div className="modal-btn-row">
                                    <button className="btn-primary" style={{ width: '100%' }} onClick={closeModal}>Close Details</button>
                                </div>
                            </React.Fragment>
                        )}
                    </div>
                </div>

                {/* Delete Confirmation Modal */}
                <div className={`modal-overlay ${modalMode === 'delete' ? 'active' : ''}`} onClick={(e) => { if(e.target.classList.contains('modal-overlay')) closeModal(); }}>
                    <div className="modal-content">
                        <button className="modal-close" onClick={closeModal}>×</button>
                        <h3 style={{ fontFamily: 'var(--font-tech)', color: 'var(--accent-teal)', marginBottom: '15px', fontSize: '22px' }}>Confirm Deletion</h3>
                        <p style={{ fontSize: '13px', marginBottom: '20px', opacity: 0.85 }}>
                            Are you absolutely sure you want to delete crude record <strong>{selectedRecord?.id} ({selectedRecord?.batch})</strong> from <strong>{selectedRecord?.unit}</strong>? This action cannot be undone.
                        </p>
                        <div className="modal-btn-row">
                            <button className="btn-secondary" onClick={closeModal}>Cancel</button>
                            <button className="btn-primary" style={{ width: 'auto', flex: 1, background: '#e74c3c' }} onClick={handleDelete}>Delete Record</button>
                        </div>
                    </div>
                </div>

            </div>
        );
    };

    // -------------------------------------------------------------------------
    // AUTOMATIC ROUTE REGISTERING:
    // Map every single UL/LI item under "MS Area's" to MSAreas so PageRenderer
    // opens this advanced view regardless of which link is clicked!
    // -------------------------------------------------------------------------
    const ALL_MS_NAV_ITEMS = [
        "MS Area's",
        "Dezinc Area's (105)", "Dezinc Reactors", "105TK05", "Polishing Filters A-F", "105TK13", "105TK08",
        "MS Area's (106)", "106TK01", "MS MS Reators", "106TK08", "Vacuum & Compressor", "Thickener", "106TK14",
        "H2S Area's", "Sulfur Area", "H2 Area", "Methanol Area", "Scrubbers Area", "N2 Gen Area",
        "F - Neut Area's", "Extraction Circuit", "Refining Phase",
        "Limestone Area", "Gas Treatment", "Emissions Logging"
    ];

    ALL_MS_NAV_ITEMS.forEach(name => {
        const sanitized = name.replace(/[^a-zA-Z0-9]/g, '');
        window[sanitized] = MSAreas;
    });
})();