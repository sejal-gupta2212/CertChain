
import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";

function CertificateQR() {
  const [certificateId, setCertificateId] = useState("");

  const verificationURL =
    `${window.location.origin}/?certificateId=${certificateId}`;

  return (
    <section className="verification-card">
      <h2>Generate Certificate QR Code</h2>

      <label>Certificate ID</label>

      <input
        type="number"
        min="1"
        placeholder="Enter Certificate ID"
        value={certificateId}
        onChange={(e) => setCertificateId(e.target.value)}
      />

      {certificateId !== "" && Number(certificateId) > 0 && (
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <QRCodeSVG
            value={verificationURL}
            size={180}
            level="M"
          />

          <p>Scan to open certificate verification</p>

          <p style={{ overflowWrap: "anywhere" }}>
            {verificationURL}
          </p>
        </div>
      )}
    </section>
  );
}

export default CertificateQR;
