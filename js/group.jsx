// js/group.jsx

(function () {
    const { useState, useEffect, useMemo, useRef } = React;

    // Component-specific styles injected safely
    const GroupStyles = `
        .grp-grid-layout { display: grid; grid-template-columns: 260px 1fr; gap: clamp(20px, 3vw, 30px); align-items: start; }
        
        /* Sidebar Styles */
        .grp-sidebar { display: flex; flex-direction: column; gap: 8px; }
        .grp-sidebar-item { 
            padding: 14px 18px; border-radius: 8px; border: 1px solid transparent; 
            cursor: pointer; transition: all 0.3s ease; display: flex; align-items: center; justify-content: space-between;
            font-family: var(--font-tech); font-size: 13px; font-weight: 700; color: var(--text-muted); text-transform: uppercase;
        }
        .grp-sidebar-item:hover { background: var(--bg-panel); color: var(--accent-teal); border-color: var(--border-light); transform: translateX(5px); }
        .grp-sidebar-item.active { 
            background: var(--bg-panel); color: var(--accent-pink); border-color: var(--accent-pink);
            box-shadow: 0 4px 15px rgba(255,105,180,0.1); border-left: 4px solid var(--accent-pink);
        }
        .grp-sidebar-count { 
            background: rgba(6,148,148,0.1); color: var(--accent-teal); padding: 2px 8px; 
            border-radius: 12px; font-size: 10px; font-family: var(--font-sans);
        }
        .grp-sidebar-item.active .grp-sidebar-count { background: var(--accent-pink); color: #fff; }

        /* Top Tabs */
        .grp-tabs { display: flex; gap: 10px; margin-bottom: 25px; border-bottom: 2px solid var(--border-light); padding-bottom: 10px; }
        .grp-tab-btn {
            background: transparent; border: none; font-family: var(--font-tech); font-size: 14px; font-weight: 700; 
            text-transform: uppercase; color: var(--text-muted); padding: 8px 16px; cursor: pointer; transition: 0.3s;
            position: relative;
        }
        .grp-tab-btn:hover { color: var(--accent-teal); }
        .grp-tab-btn.active { color: var(--accent-pink); }
        .grp-tab-btn.active::after {
            content: ''; position: absolute; bottom: -12px; left: 0; width: 100%; height: 3px; 
            background: var(--accent-pink); border-radius: 3px 3px 0 0;
        }

        /* KPI & Timeline Layout */
        .grp-top-dashboard { display: grid; grid-template-columns: 2fr 1fr; gap: 20px; margin-bottom: 25px; }
        
        .grp-kpi-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; }
        .grp-kpi-card { 
            background: var(--bg-base); border: 1px solid var(--border-light); padding: 20px; 
            border-radius: 8px; box-shadow: var(--shadow-soft); position: relative; overflow: hidden;
            display: flex; flex-direction: column; justify-content: center;
        }
        .grp-kpi-card::before { content: ''; position: absolute; left: 0; top: 0; height: 100%; width: 4px; background: var(--accent-cyan); }
        .grp-kpi-card:nth-child(even)::before { background: var(--accent-pink); }
        .grp-kpi-title { font-size: 11px; font-weight: 800; text-transform: uppercase; color: var(--text-muted); margin-bottom: 8px; display: flex; align-items: center; gap: 6px; }
        .grp-kpi-val { font-family: var(--font-tech); font-size: 28px; font-weight: 700; color: var(--accent-teal); line-height: 1; }
        
        /* Timeline */
        .grp-timeline { position: relative; padding-left: 20px; display: flex; flex-direction: column; gap: 15px; max-height: 200px; overflow-y: auto; padding-right: 5px; }
        .grp-timeline::-webkit-scrollbar { width: 4px; }
        .grp-timeline::-webkit-scrollbar-thumb { background: var(--border-panel); border-radius: 4px; }
        .grp-timeline::before { content: ''; position: absolute; left: 5px; top: 5px; bottom: 5px; width: 2px; background: var(--border-light); }
        .grp-timeline-item { position: relative; }
        .grp-timeline-dot { 
            position: absolute; left: -20px; top: 3px; width: 12px; height: 12px; 
            border-radius: 50%; background: var(--bg-base); border: 3px solid var(--accent-cyan); 
            box-shadow: 0 0 8px rgba(0,240,255,0.4);
        }
        .grp-timeline-time { font-size: 10px; font-weight: 700; color: var(--accent-pink); text-transform: uppercase; margin-bottom: 2px; }
        .grp-timeline-text { font-size: 12px; color: var(--text-main); line-height: 1.4; }

        /* Toolbar */
        .grp-toolbar { display: flex; flex-wrap: wrap; gap: 10px; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid var(--border-light); }
        .grp-toolbar-group { display: flex; gap: 10px; align-items: center; }
        .grp-tool-btn { 
            background: var(--bg-base); border: 1px solid var(--border-panel); color: var(--accent-teal); 
            padding: 8px 14px; border-radius: 6px; font-size: 11px; font-weight: 700; text-transform: uppercase; 
            cursor: pointer; transition: 0.3s; display: inline-flex; align-items: center; gap: 6px;
        }
        .grp-tool-btn:hover { background: var(--bg-panel); border-color: var(--accent-teal); color: var(--accent-teal); }
        
        /* Data Table */
        .grp-table-wrap { overflow-x: auto; border-radius: 8px; border: 1px solid var(--border-light); }
        .grp-table { width: 100%; border-collapse: collapse; text-align: left; background: #fff; }
        .grp-table th { background: var(--bg-panel); color: var(--accent-teal); font-family: var(--font-tech); font-size: 12px; padding: 14px; text-transform: uppercase; border-bottom: 2px solid var(--border-light); }
        .grp-table td { padding: 14px; font-size: 12.5px; color: var(--text-main); border-bottom: 1px solid var(--border-light); transition: background 0.2s; }
        .grp-table tr:hover td { background: rgba(6,148,148,0.02); }
        .grp-status-badge { display: inline-block; padding: 4px 10px; border-radius: 20px; font-size: 10px; font-weight: 800; text-transform: uppercase; }
        
        /* Actions */
        .grp-action-cell { display: flex; gap: 6px; justify-content: flex-end; }
        .grp-action-btn { width: 26px; height: 26px; border-radius: 6px; border: 1px solid var(--border-panel); background: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s; color: var(--accent-teal); }
        .grp-action-btn:hover { background: var(--accent-teal); color: #fff; border-color: var(--accent-teal); }
        .grp-action-btn.danger:hover { background: #e74c3c; color: #fff; border-color: #e74c3c; }

        /* ORG CHART CSS */
        .org-chart-container { width: 100%; overflow-x: auto; padding: 20px 20px 60px 20px; background: var(--bg-panel); border-radius: 8px; border: 1px solid var(--border-light); min-height: 400px; display: flex; justify-content: center; }
        .org-tree ul { padding-top: 20px; position: relative; transition: all 0.5s; display: flex; justify-content: center; padding-left: 0; margin: 0; }
        .org-tree li { float: left; text-align: center; list-style-type: none; position: relative; padding: 20px 10px 0 10px; transition: all 0.5s; }
        
        /* Org Chart Connectors */
        .org-tree li::before, .org-tree li::after { content: ''; position: absolute; top: 0; right: 50%; border-top: 2px solid var(--accent-teal); width: 50%; height: 20px; }
        .org-tree li::after { right: auto; left: 50%; border-left: 2px solid var(--accent-teal); }
        .org-tree li:only-child::after, .org-tree li:only-child::before { display: none; }
        .org-tree li:only-child { padding-top: 0; }
        .org-tree li:first-child::before, .org-tree li:last-child::after { border: 0 none; }
        .org-tree li:last-child::before { border-right: 2px solid var(--accent-teal); border-radius: 0 4px 0 0; }
        .org-tree li:first-child::after { border-radius: 4px 0 0 0; }
        .org-tree ul ul::before { content: ''; position: absolute; top: 0; left: 50%; border-left: 2px solid var(--accent-teal); width: 0; height: 20px; }
        
        /* Org Card Element */
        .org-card { 
            border: 1px solid var(--border-light); padding: 12px; display: inline-flex; flex-direction: column; align-items: center;
            border-radius: 10px; background: #fff; position: relative; min-width: 150px; box-shadow: 0 4px 15px rgba(6,148,148,0.06); 
            cursor: pointer; transition: all 0.3s; z-index: 2; border-top: 4px solid var(--accent-pink);
        }
        .org-card:hover { transform: translateY(-5px); box-shadow: var(--shadow-soft); border-color: var(--accent-pink); }
        .org-card-img { width: 50px; height: 50px; border-radius: 50%; object-fit: cover; margin-bottom: 8px; border: 2px solid var(--bg-panel); box-shadow: 0 0 0 2px var(--accent-teal); }
        .org-card-name { font-family: var(--font-tech); font-size: 13px; font-weight: 700; color: var(--accent-teal); margin-bottom: 2px; }
        .org-card-role { font-size: 10px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; }
        .org-card-empty { padding: 40px; text-align: center; color: var(--text-muted); font-size: 14px; width: 100%; }

        /* File input masking */
        .file-upload-wrapper { position: relative; overflow: hidden; display: inline-block; width: 100%; }
        .file-upload-wrapper input[type=file] { font-size: 100px; position: absolute; left: 0; top: 0; opacity: 0; cursor: pointer; height: 100%; }
        
        @media (max-width: 900px) {
            .grp-grid-layout { grid-template-columns: 1fr; }
            .grp-top-dashboard { grid-template-columns: 1fr; }
            .org-chart-container { justify-content: flex-start; }
        }
    `;

    const GROUP_AREAS = ["Group 1", "Group 2", "Group 3", "Group 4"];

    // -----------------------------------------
    // CRUDE DATA DUMMY
    // -----------------------------------------
    const DEFAULT_CRUDE_DATA = [
        { id: 'CRD-G1-01', area: 'Group 1', batch: 'BT-G1-90', type: 'Limonite', volume: '1,250', status: 'Optimal', notes: 'Standard Group 1 assignment.' },
        { id: 'CRD-G1-02', area: 'Group 1', batch: 'BT-G1-91', type: 'Mixed', volume: '980', status: 'Pending', notes: 'Awaiting assay verification.' },
        { id: 'CRD-G2-01', area: 'Group 2', batch: 'BT-G2-44', type: 'Saprolite', volume: '2,100', status: 'Optimal', notes: 'High purity batch processed.' },
        { id: 'CRD-G3-01', area: 'Group 3', batch: 'BT-G3-11', type: 'Limonite', volume: '600', status: 'Critical', notes: 'Volume mismatch detected.' },
        { id: 'CRD-G4-01', area: 'Group 4', batch: 'BT-G4-09', type: 'Reagent', volume: '4,500', status: 'Optimal', notes: 'Chemical feed lines cleared.' },
    ];

    const TIMELINE_EVENTS = {
        "Group 1": [{ time: "09:15 AM", text: "Batch BT-G1-90 transferred." }, { time: "07:00 AM", text: "Shift handover to Team Alpha." }],
        "Group 2": [{ time: "10:20 AM", text: "Saprolite screening initiated." }],
        "Group 3": [{ time: "11:05 AM", text: "Critical Alert flagged for BT-G3-11." }],
        "Group 4": [{ time: "08:55 AM", text: "Reagent flow calibration successful." }]
    };

    // -----------------------------------------
    // ORG CHART DATA DUMMY
    // -----------------------------------------
    const DEFAULT_ORG_DATA = [
        // Group 1
        { id: 'o1', area: 'Group 1', parentId: null, name: 'Arthur Pendragon', role: 'Group 1 Director', imgUrl: 'https://randomuser.me/api/portraits/men/32.jpg' },
        { id: 'o2', area: 'Group 1', parentId: 'o1', name: 'Gawain Knight', role: 'Operations Head', imgUrl: 'https://randomuser.me/api/portraits/men/44.jpg' },
        { id: 'o3', area: 'Group 1', parentId: 'o1', name: 'Morgan Le Fay', role: 'Safety Compliance', imgUrl: 'https://randomuser.me/api/portraits/women/44.jpg' },
        { id: 'o4', area: 'Group 1', parentId: 'o2', name: 'Lancelot Du Lac', role: 'Shift Supervisor', imgUrl: 'https://randomuser.me/api/portraits/men/22.jpg' },
        { id: 'o5', area: 'Group 1', parentId: 'o2', name: 'Guinevere Queen', role: 'Process Engineer', imgUrl: 'https://randomuser.me/api/portraits/women/12.jpg' },
        // Group 2
        { id: 'o6', area: 'Group 2', parentId: null, name: 'Leon Kennedy', role: 'Group 2 Manager', imgUrl: 'https://randomuser.me/api/portraits/men/62.jpg' },
        { id: 'o7', area: 'Group 2', parentId: 'o6', name: 'Claire Redfield', role: 'Lead Technician', imgUrl: 'https://randomuser.me/api/portraits/women/62.jpg' },
    ];

    const emptyCrudeForm = { batch: '', type: 'Limonite', volume: '', status: 'Optimal', notes: '' };
    const emptyOrgForm = { name: '', role: '', imgUrl: '', parentId: '' };

    const GroupOverview = ({ viewName, Icon }) => {
        
        const determineInitialArea = () => GROUP_AREAS.includes(viewName) ? viewName : GROUP_AREAS[0];
        const [activeArea, setActiveArea] = useState(determineInitialArea());
        const [activeTab, setActiveTab] = useState('operations'); // 'operations' or 'orgchart'
        
        // Data States
        const [searchQuery, setSearchQuery] = useState("");
        const [crudeData, setCrudeData] = useState(DEFAULT_CRUDE_DATA);
        const [orgData, setOrgData] = useState(DEFAULT_ORG_DATA);
        
        // Modal States (Crude)
        const [crudeModal, setCrudeModal] = useState(null); 
        const [selectedCrude, setSelectedCrude] = useState(null);
        const [crudeForm, setCrudeForm] = useState(emptyCrudeForm);

        // Modal States (Org Chart)
        const [orgModal, setOrgModal] = useState(null);
        const [selectedOrg, setSelectedOrg] = useState(null);
        const [orgForm, setOrgForm] = useState(emptyOrgForm);

        // Synchronize Dropdown Changes
        useEffect(() => {
            if (GROUP_AREAS.includes(viewName)) setActiveArea(viewName);
        }, [viewName]);

        // Helpers
        const triggerToast = (title, sub) => window.pushNetToast ? window.pushNetToast({ icon: 'check', title, sub }) : alert(`${title}: ${sub}`);
        const getStatusClass = (s) => s === 'Optimal' ? 'status-optimal' : s === 'Pending' ? 'status-pending' : 'status-critical';

        // -----------------------------------------
        // CRUDE DATA LOGIC
        // -----------------------------------------
        const filteredCrude = useMemo(() => crudeData.filter(item => item.area === activeArea && (item.batch.toLowerCase().includes(searchQuery.toLowerCase()) || item.id.toLowerCase().includes(searchQuery.toLowerCase()))), [crudeData, activeArea, searchQuery]);

        const openCrudeAdd = () => { setCrudeForm(emptyCrudeForm); setCrudeModal('add'); };
        const openCrudeEdit = (r) => { setSelectedCrude(r); setCrudeForm({...r}); setCrudeModal('edit'); };
        const openCrudeView = (r) => { setSelectedCrude(r); setCrudeModal('view'); };
        const openCrudeDelete = (r) => { setSelectedCrude(r); setCrudeModal('delete'); };
        const closeCrudeModal = () => { setCrudeModal(null); setSelectedCrude(null); setCrudeForm(emptyCrudeForm); };

        const saveCrude = () => {
            if (!crudeForm.batch || !crudeForm.volume) return;
            if (crudeModal === 'add') {
                setCrudeData([{ id: `CRD-G${activeArea.replace(/\D/g, '')}-${Date.now().toString().slice(-4)}`, area: activeArea, ...crudeForm }, ...crudeData]);
                triggerToast("Crude Added", `${crudeForm.batch} allocated to ${activeArea}.`);
            } else if (crudeModal === 'edit') {
                setCrudeData(crudeData.map(item => item.id === selectedCrude.id ? { ...item, ...crudeForm } : item));
                triggerToast("Crude Updated", `${crudeForm.batch} modified successfully.`);
            }
            closeCrudeModal();
        };

        const deleteCrude = () => {
            setCrudeData(crudeData.filter(item => item.id !== selectedCrude.id));
            triggerToast("Crude Deleted", `${selectedCrude.batch} removed.`);
            closeCrudeModal();
        };

        // -----------------------------------------
        // ORG CHART LOGIC
        // -----------------------------------------
        const currentGroupOrg = useMemo(() => orgData.filter(o => o.area === activeArea), [orgData, activeArea]);
        
        // Build Tree structure for rendering
        const orgTree = useMemo(() => {
            const map = {};
            const roots = [];
            currentGroupOrg.forEach(node => { map[node.id] = { ...node, children: [] }; });
            currentGroupOrg.forEach(node => {
                if (node.parentId && map[node.parentId]) {
                    map[node.parentId].children.push(map[node.id]);
                } else {
                    roots.push(map[node.id]);
                }
            });
            return roots;
        }, [currentGroupOrg]);

        const openOrgAdd = () => { setOrgForm(emptyOrgForm); setOrgModal('add'); };
        const openOrgView = (node) => { setSelectedOrg(node); setOrgModal('view'); };
        const openOrgEdit = () => { setOrgForm({...selectedOrg}); setOrgModal('edit'); };
        const openOrgDelete = () => { setOrgModal('delete'); };
        const closeOrgModal = () => { setOrgModal(null); setSelectedOrg(null); setOrgForm(emptyOrgForm); };

        const handleImageUpload = (e) => {
            const file = e.target.files[0];
            if (file) {
                const url = URL.createObjectURL(file);
                setOrgForm({ ...orgForm, imgUrl: url });
            }
        };

        const saveOrg = () => {
            if (!orgForm.name || !orgForm.role) return;
            if (orgModal === 'add') {
                const newMember = { id: `org-${Date.now()}`, area: activeArea, ...orgForm };
                // If parentId is empty string, make it null
                newMember.parentId = newMember.parentId === '' ? null : newMember.parentId;
                setOrgData([...orgData, newMember]);
                triggerToast("Member Added", `${orgForm.name} added to ${activeArea}.`);
            } else if (orgModal === 'edit') {
                setOrgData(orgData.map(item => item.id === selectedOrg.id ? { ...item, ...orgForm, parentId: orgForm.parentId === '' ? null : orgForm.parentId } : item));
                triggerToast("Member Updated", `${orgForm.name} profile updated.`);
            }
            closeOrgModal();
        };

        const deleteOrg = () => {
            // Remove node, and set children's parentId to null (or delete recursively, but flat update is safer here)
            const updated = orgData.map(item => item.parentId === selectedOrg.id ? { ...item, parentId: null } : item).filter(item => item.id !== selectedOrg.id);
            setOrgData(updated);
            triggerToast("Member Removed", `${selectedOrg.name} removed from ${activeArea}.`);
            closeOrgModal();
        };

        // Recursive render function for the tree
        const renderOrgNodes = (nodes) => {
            if (!nodes || nodes.length === 0) return null;
            return (
                <ul>
                    {nodes.map(node => (
                        <li key={node.id}>
                            <div className="org-card" onClick={() => openOrgView(node)}>
                                <img src={node.imgUrl || 'https://via.placeholder.com/150'} className="org-card-img" alt={node.name} />
                                <div className="org-card-name">{node.name}</div>
                                <div className="org-card-role">{node.role}</div>
                            </div>
                            {node.children.length > 0 && renderOrgNodes(node.children)}
                        </li>
                    ))}
                </ul>
            );
        };


        return (
            <div className="grp-wrapper">
                <style dangerouslySetInnerHTML={{ __html: GroupStyles }} />
                
                <div className="grp-grid-layout">
                    
                    {/* LEFT SIDEBAR */}
                    <div className="content-panel" style={{ padding: '20px' }}>
                        <div className="section-header" style={{ marginBottom: '15px', paddingBottom: '10px' }}>
                            <h3 style={{ fontSize: '15px' }}><Icon name="profile" /> Operational Groups</h3>
                        </div>
                        <div className="grp-sidebar">
                            {GROUP_AREAS.map(area => {
                                const count = crudeData.filter(d => d.area === area).length;
                                return (
                                    <div 
                                        key={area} 
                                        className={`grp-sidebar-item ${activeArea === area ? 'active' : ''}`}
                                        onClick={() => { setActiveArea(area); setSearchQuery(''); setActiveTab('operations'); }}
                                    >
                                        {area}
                                        <span className="grp-sidebar-count">{count}</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* MAIN CONTENT AREA */}
                    <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                        
                        {/* Tab Switcher */}
                        <div className="grp-tabs">
                            <button className={`grp-tab-btn ${activeTab === 'operations' ? 'active' : ''}`} onClick={() => setActiveTab('operations')}>
                                Operations & Logs
                            </button>
                            <button className={`grp-tab-btn ${activeTab === 'orgchart' ? 'active' : ''}`} onClick={() => setActiveTab('orgchart')}>
                                Organization Chart
                            </button>
                        </div>

                        {/* =======================
                            OPERATIONS TAB 
                            ======================= */}
                        {activeTab === 'operations' && (
                            <React.Fragment>
                                {/* KPI & Timeline */}
                                <div className="grp-top-dashboard">
                                    <div className="grp-kpi-grid">
                                        <div className="grp-kpi-card">
                                            <div className="grp-kpi-title"><Icon name="supply" /> Assigned Batches</div>
                                            <div className="grp-kpi-val">{filteredCrude.length}</div>
                                        </div>
                                        <div className="grp-kpi-card">
                                            <div className="grp-kpi-title"><Icon name="area" /> Volumetric Load (m³)</div>
                                            <div className="grp-kpi-val">
                                                {filteredCrude.reduce((sum, item) => sum + parseInt(item.volume.replace(/,/g, '') || 0), 0).toLocaleString()}
                                            </div>
                                        </div>
                                        <div className="grp-kpi-card">
                                            <div className="grp-kpi-title"><Icon name="security" /> Operation Status</div>
                                            <div className="grp-kpi-val" style={{ color: '#1FAA59', fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <Icon name="check" style={{ width: 20, height: 20 }} /> Stable
                                            </div>
                                        </div>
                                        <div className="grp-kpi-card">
                                            <div className="grp-kpi-title"><Icon name="policy" /> Group Warnings</div>
                                            <div className="grp-kpi-val" style={{ color: 'var(--accent-pink)' }}>
                                                {filteredCrude.filter(d => d.status === 'Critical').length}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="content-panel" style={{ padding: '20px' }}>
                                        <div className="section-header" style={{ marginBottom: '15px', paddingBottom: '10px' }}>
                                            <h3 style={{ fontSize: '14px' }}><Icon name="calendar" /> {activeArea} Timeline</h3>
                                        </div>
                                        <div className="grp-timeline">
                                            {(TIMELINE_EVENTS[activeArea] || []).map((ev, i) => (
                                                <div className="grp-timeline-item" key={i}>
                                                    <div className="grp-timeline-dot"></div>
                                                    <div className="grp-timeline-time">{ev.time}</div>
                                                    <div className="grp-timeline-text">{ev.text}</div>
                                                </div>
                                            ))}
                                            {(!TIMELINE_EVENTS[activeArea] || TIMELINE_EVENTS[activeArea].length === 0) && (
                                                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>No events for {activeArea}.</div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* DATA TABLE PANEL */}
                                <div className="content-panel">
                                    <div className="section-header">
                                        <h3><Icon name="operations2" /> Crude & Batch Logs — {activeArea}</h3>
                                    </div>

                                    {/* Toolbar */}
                                    <div className="grp-toolbar">
                                        <div className="grp-toolbar-group">
                                            <input type="text" className="search-all" placeholder="Search Crude ID or Batch..." 
                                                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                                                style={{ width: '240px', padding: '9px 14px', fontSize: '12px' }} />
                                        </div>
                                        <div className="grp-toolbar-group">
                                            <button className="bulletin-add-btn" onClick={openCrudeAdd}><Icon name="plus" /> Assign Crude</button>
                                            <button className="grp-tool-btn" onClick={() => triggerToast("Sync", "Cloud uploaded")}><Icon name="route" /> Upload</button>
                                            <button className="grp-tool-btn" onClick={() => triggerToast("Archive", "Downloaded CSV")}><Icon name="area" /> Download</button>
                                        </div>
                                    </div>

                                    {/* Table */}
                                    <div className="grp-table-wrap">
                                        <table className="grp-table">
                                            <thead>
                                                <tr>
                                                    <th>Record ID</th>
                                                    <th>Batch Number</th>
                                                    <th>Classification</th>
                                                    <th>Volume (m³)</th>
                                                    <th>Status</th>
                                                    <th style={{ textAlign: 'right' }}>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredCrude.length === 0 ? (
                                                    <tr><td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>No records found.</td></tr>
                                                ) : (
                                                    filteredCrude.map(row => (
                                                        <tr key={row.id}>
                                                            <td style={{ fontWeight: 700, color: 'var(--accent-teal)' }}>{row.id}</td>
                                                            <td style={{ fontWeight: 600 }}>{row.batch}</td>
                                                            <td>{row.type}</td>
                                                            <td style={{ fontFamily: 'var(--font-tech)', fontWeight: 700 }}>{row.volume}</td>
                                                            <td><span className={`grp-status-badge ${getStatusClass(row.status)}`}>{row.status}</span></td>
                                                            <td>
                                                                <div className="grp-action-cell">
                                                                    <button className="grp-action-btn" onClick={() => openCrudeView(row)} title="View"><Icon name="eye" /></button>
                                                                    <button className="grp-action-btn" onClick={() => openCrudeEdit(row)} title="Edit"><Icon name="edit" /></button>
                                                                    <button className="grp-action-btn danger" onClick={() => openCrudeDelete(row)} title="Delete"><Icon name="trash" /></button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </React.Fragment>
                        )}

                        {/* =======================
                            ORG CHART TAB 
                            ======================= */}
                        {activeTab === 'orgchart' && (
                            <div className="content-panel" style={{ padding: '20px' }}>
                                <div className="section-header" style={{ marginBottom: '15px' }}>
                                    <h3><Icon name="profile" /> {activeArea} Hierarchy</h3>
                                    <div className="grp-toolbar-group">
                                        <button className="bulletin-add-btn" onClick={openOrgAdd}>
                                            <Icon name="plus" /> Add Member
                                        </button>
                                    </div>
                                </div>
                                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '20px' }}>
                                    Interactive view of personnel structure. Click on any member to view details, update roles, or manage reports.
                                </p>

                                <div className="org-chart-container org-tree">
                                    {orgTree.length === 0 ? (
                                        <div className="org-card-empty">No organizational structure defined for this group yet. Click "Add Member" to begin.</div>
                                    ) : (
                                        renderOrgNodes(orgTree)
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* ====================================
                    MODALS: CRUDE DATA
                    ==================================== */}
                <div className={`modal-overlay ${(crudeModal === 'add' || crudeModal === 'edit') ? 'active' : ''}`} onClick={(e) => { if(e.target.classList.contains('modal-overlay')) closeCrudeModal(); }}>
                    <div className="modal-content wide">
                        <button className="modal-close" onClick={closeCrudeModal}>×</button>
                        <h3 style={{ fontFamily: 'var(--font-tech)', color: 'var(--accent-teal)', fontSize: '22px', marginBottom: '20px' }}>
                            {crudeModal === 'add' ? `Assign Crude to ${activeArea}` : 'Edit Assigned Crude'}
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                            <div>
                                <label className="field-label">Batch Reference</label>
                                <input className="field-input" value={crudeForm.batch} onChange={(e) => setCrudeForm({...crudeForm, batch: e.target.value})} />
                            </div>
                            <div>
                                <label className="field-label">Crude Classification</label>
                                <select className="field-select" value={crudeForm.type} onChange={(e) => setCrudeForm({...crudeForm, type: e.target.value})}>
                                    <option value="Limonite">Limonite Feed</option>
                                    <option value="Saprolite">Saprolite Ore</option>
                                    <option value="Mixed">Mixed Profile</option>
                                    <option value="Residue">Tailing Residue</option>
                                    <option value="Reagent">Chemical Reagent</option>
                                </select>
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '15px' }}>
                            <div>
                                <label className="field-label">Volume Estimate (m³)</label>
                                <input className="field-input" value={crudeForm.volume} onChange={(e) => setCrudeForm({...crudeForm, volume: e.target.value})} />
                            </div>
                            <div>
                                <label className="field-label">Process Status</label>
                                <select className="field-select" value={crudeForm.status} onChange={(e) => setCrudeForm({...crudeForm, status: e.target.value})}>
                                    <option value="Optimal">Optimal Flow</option>
                                    <option value="Pending">Pending Review</option>
                                    <option value="Critical">Critical Alert</option>
                                </select>
                            </div>
                        </div>
                        <div style={{ marginTop: '15px' }}>
                            <label className="field-label">Execution Notes</label>
                            <textarea className="field-textarea" value={crudeForm.notes} onChange={(e) => setCrudeForm({...crudeForm, notes: e.target.value})}></textarea>
                        </div>
                        <div className="modal-btn-row">
                            <button className="btn-secondary" onClick={closeCrudeModal}>Cancel</button>
                            <button className="btn-primary" style={{ flex: 1 }} onClick={saveCrude} disabled={!crudeForm.batch || !crudeForm.volume}>
                                {crudeModal === 'add' ? 'Confirm Assignment' : 'Update Log'}
                            </button>
                        </div>
                    </div>
                </div>

                <div className={`modal-overlay ${crudeModal === 'view' ? 'active' : ''}`} onClick={(e) => { if(e.target.classList.contains('modal-overlay')) closeCrudeModal(); }}>
                    <div className="modal-content">
                        <button className="modal-close" onClick={closeCrudeModal}>×</button>
                        {selectedCrude && (
                            <React.Fragment>
                                <div className="modal-view-tag">{activeArea} — Batch Profile</div>
                                <h3 style={{ fontFamily: 'var(--font-tech)', color: 'var(--accent-teal)', fontSize: '21px' }}>{selectedCrude.id} <br/><span style={{fontSize: '14px', color: 'var(--text-muted)'}}>Batch: {selectedCrude.batch}</span></h3>
                                <div style={{ margin: '20px 0', background: 'var(--bg-panel)', padding: '15px', borderRadius: '8px', borderLeft: '4px solid var(--accent-pink)' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', fontSize: '13px' }}>
                                        <div><strong>Assigned To:</strong> <br/>{selectedCrude.area}</div>
                                        <div><strong>Material Type:</strong> <br/>{selectedCrude.type}</div>
                                        <div><strong>Registered Volume:</strong> <br/>{selectedCrude.volume} m³</div>
                                        <div><strong>Current Status:</strong> <br/><span className={`grp-status-badge ${getStatusClass(selectedCrude.status)}`}>{selectedCrude.status}</span></div>
                                    </div>
                                </div>
                                <h5 style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--accent-teal)', marginBottom: '5px' }}>Group Execution Notes</h5>
                                <p className="modal-view-desc" style={{ marginTop: 0 }}>{selectedCrude.notes || 'No remarks added.'}</p>
                                <div className="modal-btn-row">
                                    <button className="btn-primary" style={{ width: '100%' }} onClick={closeCrudeModal}>Acknowledge & Close</button>
                                </div>
                            </React.Fragment>
                        )}
                    </div>
                </div>

                <div className={`modal-overlay ${crudeModal === 'delete' ? 'active' : ''}`} onClick={(e) => { if(e.target.classList.contains('modal-overlay')) closeCrudeModal(); }}>
                    <div className="modal-content">
                        <button className="modal-close" onClick={closeCrudeModal}>×</button>
                        <h3 style={{ fontFamily: 'var(--font-tech)', color: 'var(--accent-teal)', marginBottom: '15px', fontSize: '22px' }}>Void Allocation</h3>
                        <p style={{ fontSize: '13px', marginBottom: '20px' }}>Are you certain you wish to void batch <strong>{selectedCrude?.batch}</strong>?</p>
                        <div className="modal-btn-row">
                            <button className="btn-secondary" onClick={closeCrudeModal}>Cancel</button>
                            <button className="btn-primary" style={{ flex: 1, background: '#e74c3c' }} onClick={deleteCrude}>Void Assignment</button>
                        </div>
                    </div>
                </div>

                {/* ====================================
                    MODALS: ORG CHART
                    ==================================== */}
                <div className={`modal-overlay ${(orgModal === 'add' || orgModal === 'edit') ? 'active' : ''}`} onClick={(e) => { if(e.target.classList.contains('modal-overlay')) closeOrgModal(); }}>
                    <div className="modal-content wide">
                        <button className="modal-close" onClick={closeOrgModal}>×</button>
                        <h3 style={{ fontFamily: 'var(--font-tech)', color: 'var(--accent-teal)', fontSize: '22px', marginBottom: '20px' }}>
                            {orgModal === 'add' ? `Add Member to ${activeArea}` : 'Update Member Profile'}
                        </h3>
                        
                        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '20px' }}>
                            <div style={{ width: '80px', height: '80px', borderRadius: '50%', border: '2px solid var(--accent-teal)', overflow: 'hidden', flexShrink: 0, position: 'relative', background: 'var(--bg-panel)' }}>
                                <img src={orgForm.imgUrl || 'https://via.placeholder.com/150'} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label className="field-label" style={{ marginTop: 0 }}>Profile Picture (URL or Browse)</label>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <input className="field-input" placeholder="Paste image URL here..." value={orgForm.imgUrl} onChange={(e) => setOrgForm({...orgForm, imgUrl: e.target.value})} style={{ flex: 1 }} />
                                    <div className="file-upload-wrapper btn-secondary" style={{ width: 'auto', padding: '10px 15px', borderRadius: '5px', textAlign: 'center', cursor: 'pointer', border: '1px solid var(--accent-teal)' }}>
                                        Browse
                                        <input type="file" accept="image/*" onChange={handleImageUpload} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                            <div>
                                <label className="field-label">Full Name</label>
                                <input className="field-input" placeholder="e.g. John Doe" value={orgForm.name} onChange={(e) => setOrgForm({...orgForm, name: e.target.value})} />
                            </div>
                            <div>
                                <label className="field-label">Job Title / Role</label>
                                <input className="field-input" placeholder="e.g. Lead Engineer" value={orgForm.role} onChange={(e) => setOrgForm({...orgForm, role: e.target.value})} />
                            </div>
                        </div>
                        
                        <div style={{ marginTop: '15px' }}>
                            <label className="field-label">Reports To (Parent Node)</label>
                            <select className="field-select" value={orgForm.parentId || ''} onChange={(e) => setOrgForm({...orgForm, parentId: e.target.value})}>
                                <option value="">-- None (Set as Root/Head) --</option>
                                {currentGroupOrg.filter(m => m.id !== selectedOrg?.id).map(m => (
                                    <option key={m.id} value={m.id}>{m.name} — {m.role}</option>
                                ))}
                            </select>
                        </div>

                        <div className="modal-btn-row">
                            <button className="btn-secondary" onClick={closeOrgModal}>Cancel</button>
                            <button className="btn-primary" style={{ flex: 1 }} onClick={saveOrg} disabled={!orgForm.name || !orgForm.role}>
                                {orgModal === 'add' ? 'Save Member' : 'Update Profile'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* View Org Member Modal */}
                <div className={`modal-overlay ${orgModal === 'view' ? 'active' : ''}`} onClick={(e) => { if(e.target.classList.contains('modal-overlay')) closeOrgModal(); }}>
                    <div className="modal-content person-modal">
                        <button className="modal-close" onClick={closeOrgModal}>×</button>
                        {selectedOrg && (
                            <React.Fragment>
                                <div className="person-modal-photo" style={{ width: '100px', height: '100px', margin: '0 auto 15px' }}>
                                    <img src={selectedOrg.imgUrl || 'https://via.placeholder.com/150'} alt={selectedOrg.name} />
                                </div>
                                <div className="person-modal-name">{selectedOrg.name}</div>
                                <div className="person-modal-role" style={{ marginBottom: '10px' }}>{selectedOrg.role}</div>
                                <span className="person-modal-tag" style={{ background: 'var(--accent-teal)' }}>
                                    <Icon name="profile" /> {selectedOrg.area}
                                </span>
                                
                                <div className="person-modal-detail-row" style={{ marginTop: '20px' }}>
                                    <span className="person-modal-detail-label">Reports To</span>
                                    <span className="person-modal-detail-value">
                                        {selectedOrg.parentId ? (currentGroupOrg.find(m => m.id === selectedOrg.parentId)?.name || 'Unknown') : 'Group Head'}
                                    </span>
                                </div>
                                <div className="person-modal-detail-row">
                                    <span className="person-modal-detail-label">Direct Reports</span>
                                    <span className="person-modal-detail-value">
                                        {currentGroupOrg.filter(m => m.parentId === selectedOrg.id).length} member(s)
                                    </span>
                                </div>

                                <div className="modal-btn-row" style={{ marginTop: '25px', gap: '8px' }}>
                                    <button className="btn-secondary" onClick={openOrgEdit} style={{ fontSize: '11px', padding: '10px' }}><Icon name="edit" style={{width:'12px', verticalAlign:'middle'}}/> Edit</button>
                                    <button className="btn-secondary" onClick={openOrgDelete} style={{ fontSize: '11px', padding: '10px', color: '#e74c3c', borderColor: '#e74c3c' }}><Icon name="trash" style={{width:'12px', verticalAlign:'middle'}}/> Remove</button>
                                    <button className="btn-primary" onClick={closeOrgModal} style={{ fontSize: '11px', padding: '10px' }}>Done</button>
                                </div>
                            </React.Fragment>
                        )}
                    </div>
                </div>

                <div className={`modal-overlay ${orgModal === 'delete' ? 'active' : ''}`} onClick={(e) => { if(e.target.classList.contains('modal-overlay')) closeOrgModal(); }}>
                    <div className="modal-content">
                        <button className="modal-close" onClick={closeOrgModal}>×</button>
                        <h3 style={{ fontFamily: 'var(--font-tech)', color: 'var(--accent-teal)', marginBottom: '15px', fontSize: '22px' }}>Remove Member</h3>
                        <p style={{ fontSize: '13px', marginBottom: '20px' }}>Are you sure you want to remove <strong>{selectedOrg?.name}</strong> from the organization chart? Any direct reports will be reassigned to the Group Head.</p>
                        <div className="modal-btn-row">
                            <button className="btn-secondary" onClick={() => setOrgModal('view')}>Cancel</button>
                            <button className="btn-primary" style={{ flex: 1, background: '#e74c3c' }} onClick={deleteOrg}>Confirm Removal</button>
                        </div>
                    </div>
                </div>

            </div>
        );
    };

    // Attach component to window dynamically for all Group Sub-Menus
    window.Group = GroupOverview;
    window.Group1 = GroupOverview;
    window.Group2 = GroupOverview;
    window.Group3 = GroupOverview;
    window.Group4 = GroupOverview;

})();