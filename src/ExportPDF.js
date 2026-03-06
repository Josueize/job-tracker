import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function exportToPDF(jobs, email) {
  const doc = new jsPDF();

  doc.setFillColor(10, 10, 15);
  doc.rect(0, 0, 210, 40, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("JobTrackr", 14, 20);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(150, 150, 180);
  doc.text(`Job Applications Report — ${email}`, 14, 30);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 37);

  const stats = [
    { label: "Total", value: jobs.length },
    { label: "Applied", value: jobs.filter(j => j.status === "Applied").length },
    { label: "Interview", value: jobs.filter(j => j.status === "Interview").length },
    { label: "Offer", value: jobs.filter(j => j.status === "Offer").length },
    { label: "Rejected", value: jobs.filter(j => j.status === "Rejected").length },
  ];

  let x = 14;
  stats.forEach(s => {
    doc.setTextColor(79, 110, 247);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(String(s.value), x, 55);
    doc.setTextColor(150, 150, 180);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(s.label, x, 61);
    x += 38;
  });

  autoTable(doc, {
    startY: 70,
    head: [["Company", "Role", "Status", "Date Applied", "Notes"]],
    body: jobs.map(j => [
      j.company,
      j.role,
      j.status,
      j.date ? new Date(j.date).toLocaleDateString() : "-",
      j.notes || "-"
    ]),
    headStyles: {
      fillColor: [17, 17, 24],
      textColor: [150, 150, 180],
      fontStyle: "bold",
      fontSize: 9,
    },
    bodyStyles: {
      fillColor: [13, 13, 20],
      textColor: [226, 232, 240],
      fontSize: 9,
    },
    alternateRowStyles: {
      fillColor: [17, 17, 24],
    },
  });

  doc.save(`jobtrackr-report-${new Date().toISOString().split("T")[0]}.pdf`);
}