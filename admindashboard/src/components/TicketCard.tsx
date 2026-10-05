import './TicketCard.css';

export default function TicketCard({}){
    return(
        <div className="metal-card">
      {/* Header */}
      <div className="metal-header">
        <span className="metal-title">TICKET #8492-A</span>
        <span className="metal-badge-green">STATUS: OPEN</span>
      </div>

      {/* Image / Evidence */}
      <div className="metal-image-container">
        <img 
          src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=600&auto=format&fit=crop" 
          alt="Equipment Evidence" 
          className="metal-image" 
        />
      </div>

      {/* Body Information */}
      <div className="metal-body">
        
        
        <div className="metal-row">
          <div className="metal-section flex-1">
            <div className="metal-label">Session / Topic</div>
            <div className="metal-value">Lab 4: Modbus TCP</div>
          </div>
          <div className="metal-section flex-1">
            <div className="metal-label">Date</div>
            <div className="metal-value">Oct 14, 2026</div>
          </div>
        </div>

        <div className="metal-section">
          <div className="metal-label">Responsable</div>
          <div className="metal-value">Mateo Vásquez (Técnico Docente)</div>
        </div>

        <div className="metal-section inset-deep">
          <div className="metal-label accent-blue">Observation</div>
          <div className="metal-value">
            Channel 2 is unresponsive. High voltage spike suspected during the frequency testing phase. Requires immediate recalibration and quarantine.
          </div>
        </div>

        <div className="metal-section">
          <div className="metal-label">Affected Equipment</div>
          <div className="metal-value">Oscilloscope Tektronix TBS1052B (ID: EQ-045)</div>
        </div>
        
      </div>

      {/* Footer Actions */}
      <div className="metal-footer">
        <button className="metal-button">ACKNOWLEDGE & LOCK</button>
      </div>
    </div>
    )
}