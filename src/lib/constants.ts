import { 
  BusinessUnit, 
  CostCenter, 
  StarliteSubscriber, 
  StarliteInvoice, 
  BudgetRequest,
  FinancialTransaction,
  MonthlyFinancialSummary,
  SalesInvoice,
  OfficialReceiptBKM
} from "@/types";

export const COMPANY_NAME = "PT. Jayahana Manaura Mekanika Selaras";

export const BUSINESS_UNITS: { key: BusinessUnit; label: string; color: string; desc: string }[] = [
  {
    key: "ME_CORE",
    label: "Jasa Mekanik & Elektronik (ME Core)",
    color: "bg-blue-600 text-white",
    desc: "Proyek instalasi, perawatan, dan pengadaan sistem ME industri dan gedung.",
  },
  {
    key: "STARLITE_FTTH",
    label: "Starlite (Fiber to the Home)",
    color: "bg-fuchsia-600 text-white",
    desc: "Ekspansi infrastruktur jaringan fiber optik & layanan internet berlangganan.",
  },
  {
    key: "OVERHEAD_OPERASIONAL",
    label: "Overhead & Operasional Kantor",
    color: "bg-slate-600 text-white",
    desc: "Biaya umum, utilitas kantor pusat, HR/GA, dan perizinan.",
  },
];

export const INITIAL_COST_CENTERS: CostCenter[] = [
  {
    id: "cc-me-01",
    code: "CC-ME-2026-001",
    name: "Proyek Instalasi Listrik & Panel Pabrik KIIC",
    unit: "ME_CORE",
    projectCode: "SPK-ME-KIIC-01",
    budgetLimit: 250000000,
    allocatedAmount: 180000000,
    spentAmount: 145000000,
  },
  {
    id: "cc-me-02",
    code: "CC-ME-2026-002",
    name: "Maintenance Chiller & HVAC Gedung Menara",
    unit: "ME_CORE",
    projectCode: "SPK-ME-MNR-04",
    budgetLimit: 120000000,
    allocatedAmount: 90000000,
    spentAmount: 72500000,
  },
  {
    id: "cc-star-01",
    code: "CC-STAR-EXP-01",
    name: "Penggelaran OLT & Feeder Cluster Sentul City",
    unit: "STARLITE_FTTH",
    clusterCode: "CLUSTER-SENTUL-01",
    budgetLimit: 400000000,
    allocatedAmount: 320000000,
    spentAmount: 285000000,
  },
  {
    id: "cc-star-02",
    code: "CC-STAR-OPEX-01",
    name: "Operasional Drop Cable & Pasang Baru Pelanggan",
    unit: "STARLITE_FTTH",
    clusterCode: "OPS-INSTALL-ALL",
    budgetLimit: 85000000,
    allocatedAmount: 60000000,
    spentAmount: 48200000,
  },
];

export const INITIAL_REQUESTS: BudgetRequest[] = [
  {
    id: "req-001",
    requestNumber: "PR-2026-ME-019",
    title: "Pengadaan Kabel NYY 4x16mm & MCB Schneider",
    category: "Perlengkapan & Peralatan",
    unit: "ME_CORE",
    costCenterId: "cc-me-01",
    requesterName: "Agus Pratama",
    requesterRole: "SITE_SPV",
    requestType: "PURCHASE_REQUISITION",
    totalAmount: 18500000,
    status: "COMPLETED",
    purpose: "Material lanjutan instalasi panel incoming pabrik KIIC Karawang",
    createdAt: "2026-11-10",
    dueDate: "2026-11-25",
    items: [
      { id: "itm-1", description: "Kabel NYY 4x16mm Supreme (100 meter)", quantity: 2, unit: "Roll", estimatedPrice: 7500000, totalPrice: 15000000 },
      { id: "itm-2", description: "MCB 3 Phase 63A Schneider Acti9", quantity: 5, unit: "Pcs", estimatedPrice: 700000, totalPrice: 3500000 }
    ],
    procurementItems: [
      { id: "pi-1", itemCode: "KBL-NYY-16", itemName: "Kabel NYY 4x16mm Supreme (100m)", quantity: 2, unit: "Roll", unitPrice: 7500000, totalPrice: 15000000 },
      { id: "pi-2", itemCode: "MCB-3P-63A", itemName: "MCB 3 Phase 63A Schneider Acti9", quantity: 5, unit: "Pcs", unitPrice: 700000, totalPrice: 3500000 }
    ],
    vendorInfo: {
      vendorName: "PT. Schneider Electric & Kabel Distributor",
      paymentTerms: "Net 30",
      bankName: "Bank Central Asia (BCA)",
      bankAccountName: "PT Schneider Kabel Distribusi",
      bankAccountNumber: "542-0192-881",
      shippingAddress: "Site Proyek Gedung Pabrik KIIC Kav B-12, Karawang Barat",
      remarks: "Pengiriman sertakan surat jalan & sertifikat uji pabrik",
      isTaxable: true
    },
    disbursement: {
      disbursedAt: "2026-11-12",
      disbursedBy: "Dewi Anggraeni (Finance)",
      voucherNumber: "BKK-2026-11-019",
      sourceAccount: "BCA Operasional (No: 731-0982-11)",
      paymentMethod: "TRANSFER_BANK",
      transferReference: "TRF-BCA-9812401",
      amountPaid: 18500000,
      proofAttachment: {
        id: "att-trf-001",
        name: "Bukti_Transfer_BCA_Schneider.png",
        type: "image/png",
        size: 384000,
        dataUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80",
        uploadedAt: "12/11/2026 14:30"
      }
    },
    goodsReceipt: {
      id: "gr-001",
      receiptNumber: "BAST-2026-11-008",
      poNumber: "PR-2026-ME-019",
      requestId: "req-001",
      receivedDate: "2026-11-14",
      vendorName: "PT. Schneider Electric & Kabel Distributor",
      vendorDeliveryNoteNumber: "SJ-SCH-2026-9921",
      auditedBy: "Budi Santoso (Internal Audit)",
      warehouseStaff: "Asep Sudrajat (Logistik ME)",
      overallStatus: "VERIFIED_GOOD",
      inspectionLocation: "Gudang Utama Sentul & Site KIIC",
      items: [
        { itemId: "pi-1", itemCode: "KBL-NYY-16", itemName: "Kabel NYY 4x16mm Supreme (100m)", qtyOrdered: 2, qtyReceived: 2, unit: "Roll", condition: "GOOD", physicalAuditNotes: "Kondisi utuh segel pabrik, panjang 100m/roll terverifikasi alat ukur" },
        { itemId: "pi-2", itemCode: "MCB-3P-63A", itemName: "MCB 3 Phase 63A Schneider Acti9", qtyOrdered: 5, qtyReceived: 5, unit: "Pcs", condition: "GOOD", physicalAuditNotes: "Fisik mulus, barcode, segel SNI & kartu garansi lengkap" }
      ],
      notes: "Pemeriksaan fisik oleh Tim Audit menyatakan barang diterima dalam keadaan lengkap dan baik."
    }
  },
  {
    id: "req-002",
    requestNumber: "CA-2026-STAR-042",
    title: "Kas Bon Operasional Penarikan Kabel ODP Sentul",
    category: "Kasbon",
    unit: "STARLITE_FTTH",
    costCenterId: "cc-star-01",
    requesterName: "Rudi Haryanto",
    requesterRole: "FIELD_TECH",
    requestType: "CASH_ADVANCE",
    totalAmount: 3500000,
    status: "DISBURSED",
    purpose: "BBM mobil operasional tangga, konsumsi lembur tim teknisi, dan klem tiang darurat penarikan fiber Sentul",
    createdAt: "2026-11-15",
    dueDate: "2026-11-22",
    items: [
      { id: "itm-3", description: "BBM Operasional Lapangan (2 Mobil)", quantity: 1, unit: "Paket", estimatedPrice: 1000000, totalPrice: 1000000 },
      { id: "itm-4", description: "Aksesoris Klem Tiang & Suspension", quantity: 50, unit: "Pcs", estimatedPrice: 30000, totalPrice: 1500000 },
      { id: "itm-5", description: "Uang Makan & Lembur Teknisi (4 org)", quantity: 4, unit: "Orang", estimatedPrice: 250000, totalPrice: 1000000 }
    ],
    disbursement: {
      disbursedAt: "2026-11-16",
      disbursedBy: "Dewi Anggraeni (Finance)",
      voucherNumber: "BKK-2026-11-042",
      sourceAccount: "Kas Kecil (Petty Cash Operasional)",
      paymentMethod: "CASH_KAS_KECIL",
      transferReference: "KAS-KECIL-042",
      amountPaid: 3500000,
      proofAttachment: {
        id: "att-trf-042",
        name: "Bukti_Pencairan_Kas_Kecil_CA042.png",
        type: "image/png",
        size: 315000,
        dataUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80",
        uploadedAt: "16/11/2026 09:30"
      }
    },
    realization: {
      id: "lpj-002",
      requestId: "req-002",
      lpjNumber: "LPJ-2026-11-042",
      submittedAt: "2026-11-17",
      submittedBy: "Rudi Haryanto",
      initialAdvanceAmount: 3500000,
      totalRealizedAmount: 3350000,
      balanceDifference: 150000,
      settlementAction: "REFUND_TO_CASHIER",
      status: "PENDING_AUDIT",
      items: [
        { id: "r-1", receiptDate: "16/11/2026", description: "BBM Pertamax Mobil Tangga Lapangan", vendor: "SPBU Pertamina Sentul", receiptNumber: "STR-0912", amount: 950000 },
        { id: "r-2", receiptDate: "16/11/2026", description: "Baut Klem Tiang Tambahan", vendor: "Toko Baut Sentul", receiptNumber: "NTA-881", amount: 1420000 },
        { id: "r-3", receiptDate: "17/11/2026", description: "Konsumsi Lembur Teknisi (4 Orang)", vendor: "RM Sederhana Sentul", receiptNumber: "RM-442", amount: 980000 }
      ],
      receiptAttachments: [
        {
          id: "att-lpj-042-1",
          name: "Struk_Pertamina_BBM_STR0912.jpg",
          type: "image/jpeg",
          size: 245000,
          dataUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80",
          uploadedAt: "17/11/2026 09:15"
        },
        {
          id: "att-lpj-042-2",
          name: "Nota_Toko_Baut_Sentul_NTA881.jpg",
          type: "image/jpeg",
          size: 328000,
          dataUrl: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600&auto=format&fit=crop&q=80",
          uploadedAt: "17/11/2026 09:16"
        },
        {
          id: "att-lpj-042-3",
          name: "Struk_RM_Sederhana_RM442.jpg",
          type: "image/jpeg",
          size: 195000,
          dataUrl: "https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=600&auto=format&fit=crop&q=80",
          uploadedAt: "17/11/2026 09:18"
        }
      ],
      auditNotes: "Fisik nota BBM, klem tiang, dan konsumsi lengkap. Saldo sisa Rp 150.000 wajib disetor ke kasir."
    }
  },
  {
    id: "req-003",
    requestNumber: "PO-2026-STAR-011",
    title: "Pengadaan OLT EPON 8-Port & Splitter PLC Starlite FTTH",
    category: "Perlengkapan & Peralatan",
    unit: "STARLITE_FTTH",
    costCenterId: "cc-star-01",
    requesterName: "Agus Pratama",
    requesterRole: "PROCUREMENT",
    requestType: "PURCHASE_REQUISITION",
    totalAmount: 24500000,
    status: "PENDING_AUDIT",
    purpose: "Penguatan backbone dan ekspansi 2 cluster baru perumahan Sentul City Tahap 3",
    createdAt: "2026-11-18",
    dueDate: "2026-11-30",
    items: [
      { id: "itm-6", description: "OLT EPON 8-Port Rackmount 1U", quantity: 2, unit: "Unit", estimatedPrice: 9500000, totalPrice: 19000000 },
      { id: "itm-7", description: "Optical Splitter PLC 1:16 Cassette", quantity: 10, unit: "Box", estimatedPrice: 550000, totalPrice: 5500000 }
    ],
    procurementItems: [
      { id: "pi-3", itemCode: "OLT-EPON-8P", itemName: "OLT EPON 8-Port Rackmount 1U Gigabit", quantity: 2, unit: "Unit", unitPrice: 9500000, totalPrice: 19000000 },
      { id: "pi-4", itemCode: "SPL-PLC-1-16", itemName: "Optical Splitter PLC 1:16 Cassette Box", quantity: 10, unit: "Box", unitPrice: 550000, totalPrice: 5500000 }
    ],
    vendorInfo: {
      vendorName: "PT. Fiber Network Solusindo",
      paymentTerms: "Net 14",
      bankName: "Bank Mandiri",
      bankAccountName: "PT Fiber Network Solusindo",
      bankAccountNumber: "133-00-981244-1",
      shippingAddress: "NOC Jayahana Starlite, Sentul Business District B-08",
      remarks: "Termasuk modul SFP PX20+++ dan garansi distributor 1 tahun",
      isTaxable: true
    }
  },
  {
    id: "req-004",
    requestNumber: "CA-2026-ME-025",
    title: "Kas Bon Pengujian Tahanan Isolasi Megger & Scaffolding",
    category: "Sewa",
    unit: "ME_CORE",
    costCenterId: "cc-me-01",
    requesterName: "Iwan Setiawan",
    requesterRole: "SITE_SPV",
    requestType: "CASH_ADVANCE",
    totalAmount: 4200000,
    status: "APPROVED_READY_PAY",
    purpose: "Sewa scaffolding 4 set untuk pekerjaan kabel tray di ketinggian 8 meter dan kalibrasi alat uji",
    createdAt: "2026-11-17",
    dueDate: "2026-11-28",
    items: [
      { id: "itm-8", description: "Sewa Scaffolding 4 Set (7 Hari)", quantity: 4, unit: "Set", estimatedPrice: 650000, totalPrice: 2600000 },
      { id: "itm-9", description: "Jasa Kalibrasi Megger & Safety Inspector", quantity: 1, unit: "Paket", estimatedPrice: 1600000, totalPrice: 1600000 }
    ]
  },
  {
    id: "req-005",
    requestNumber: "CA-2026-STAR-045",
    title: "Kasbon Konsumsi & BBM Survey Jalur FO",
    category: "Operasional",
    unit: "Bandung",
    costCenterId: "cc-star-02",
    requesterName: "Dedi Supardi",
    requesterRole: "FIELD_TECH",
    requestType: "CASH_ADVANCE",
    totalAmount: 2200000,
    status: "PENDING_PM",
    purpose: "Biaya survey lapangan perizinan jalur kabel fiber optik area Bandung Timur",
    createdAt: "2026-11-20",
    dueDate: "2026-11-27",
    items: [
      { id: "itm-10", description: "BBM & Tol Mobil Lapangan", quantity: 1, unit: "Paket", estimatedPrice: 800000, totalPrice: 800000 },
      { id: "itm-11", description: "Uang Makan & Lembur Tim Survey (4 hari)", quantity: 4, unit: "Hari", estimatedPrice: 350000, totalPrice: 1400000 }
    ]
  },
  {
    id: "req-006",
    requestNumber: "PR-2026-ME-022",
    title: "Pengadaan Tangga Teleskopik & Tools Safety ME",
    category: "Perlengkapan & Peralatan",
    unit: "Rajeg & Pasar Kemis",
    costCenterId: "cc-me-01",
    requesterName: "Agus Pratama",
    requesterRole: "SITE_SPV",
    requestType: "PURCHASE_REQUISITION",
    totalAmount: 4800000,
    status: "PENDING_GM",
    purpose: "Penggantian tangga kerja rusak dan helm safety standar PLN untuk tim teknisi site",
    createdAt: "2026-11-21",
    dueDate: "2026-11-29",
    items: [
      { id: "itm-12", description: "Tangga Teleskopik 6.2 Meter Heavy Duty", quantity: 2, unit: "Unit", estimatedPrice: 1800000, totalPrice: 3600000 },
      { id: "itm-13", description: "Helm Safety Proyek V-Gard + Tali Dagu", quantity: 12, unit: "Pcs", estimatedPrice: 100000, totalPrice: 1200000 }
    ]
  },
  {
    id: "req-007",
    requestNumber: "PR-2026-STAR-015",
    title: "Pengadaan Joint Closure FO & Fusion Splicer Spare",
    category: "Perlengkapan & Peralatan",
    unit: "Cimahi",
    costCenterId: "cc-star-01",
    requesterName: "Eko Prasetyo",
    requesterRole: "PROCUREMENT",
    requestType: "PURCHASE_REQUISITION",
    totalAmount: 9500000,
    status: "PENDING_DIRECTOR",
    purpose: "Restock darurat joint closure 48 core dan penggantian electrode fusion splicer utama (nominal > 5 Juta)",
    createdAt: "2026-11-22",
    dueDate: "2026-12-02",
    items: [
      { id: "itm-14", description: "Dome Joint Closure FO 48 Core", quantity: 10, unit: "Unit", estimatedPrice: 450000, totalPrice: 4500000 },
      { id: "itm-15", description: "Electrode & Battery Spare Fusion Splicer Inno", quantity: 1, unit: "Set", estimatedPrice: 5000000, totalPrice: 5000000 }
    ]
  },
  {
    id: "req-008",
    requestNumber: "CA-2026-ME-029",
    title: "Kasbon Perbaikan Genset Standby Site Tagogapu",
    category: "Operasional",
    unit: "Tagogapu",
    costCenterId: "cc-me-01",
    requesterName: "Hendra Gunawan",
    requesterRole: "SITE_SPV",
    requestType: "CASH_ADVANCE",
    totalAmount: 3750000,
    status: "NEED_REVISION",
    purpose: "Penggantian filter oli, aki basah N70, dan flushing radiator genset backup",
    createdAt: "2026-11-21",
    dueDate: "2026-11-28",
    revisionNote: "Mohon sertakan estimasi penawaran resmi dari bengkel genset dan foto aki lama yang rusak sebelum disetujui.",
    items: [
      { id: "itm-16", description: "Aki Basah GS Yuasa N70 12V 70Ah", quantity: 1, unit: "Unit", estimatedPrice: 1750000, totalPrice: 1750000 },
      { id: "itm-17", description: "Jasa Servis, Filter & Oli Mesin Genset", quantity: 1, unit: "Paket", estimatedPrice: 2000000, totalPrice: 2000000 }
    ]
  },
  {
    id: "req-009",
    requestNumber: "CA-2026-STAR-050",
    title: "Kasbon Penarikan Kabel Drop Core & Splicing Cluster Tagogapu",
    category: "Kasbon",
    unit: "Tagogapu",
    costCenterId: "cc-star-02",
    requesterName: "Rudi Haryanto",
    requesterRole: "FIELD_TECH",
    requestType: "CASH_ADVANCE",
    totalAmount: 2500000,
    status: "DISBURSED",
    purpose: "Biaya klem darurat tiang PLN, sewa tangga bambu tambahan, dan BBM tim penarikan kabel drop core",
    createdAt: "2026-11-18",
    dueDate: "2026-11-25",
    disbursedAt: "2026-11-19",
    items: [
      { id: "itm-18", description: "BBM & Operasional Mobil Lapangan", quantity: 1, unit: "Paket", estimatedPrice: 700000, totalPrice: 700000 },
      { id: "itm-19", description: "Aksesoris Klem Tiang FO & Kabel Ties", quantity: 1, unit: "Paket", estimatedPrice: 1000000, totalPrice: 1000000 },
      { id: "itm-20", description: "Konsumsi Lembur Teknisi (3 Hari)", quantity: 3, unit: "Hari", estimatedPrice: 266667, totalPrice: 800000 }
    ],
    disbursement: {
      disbursedAt: "2026-11-19",
      disbursedBy: "Dewi Anggraeni (Finance)",
      voucherNumber: "BKK-2026-11-050",
      sourceAccount: "Kas Kecil Lapangan (Petty Cash)",
      paymentMethod: "CASH_KAS_KECIL",
      transferReference: "KAS-KECIL-050",
      amountPaid: 2500000,
      proofAttachment: {
        id: "att-trf-050",
        name: "Bukti_Pencairan_Kas_Kecil_CA050.png",
        type: "image/png",
        size: 295000,
        dataUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80",
        uploadedAt: "19/11/2026 11:20"
      }
    },
    realization: {
      id: "lpj-009",
      requestId: "req-009",
      lpjNumber: "LPJ-2026-11-050",
      submittedAt: "2026-11-21",
      submittedBy: "Rudi Haryanto",
      initialAdvanceAmount: 2500000,
      totalRealizedAmount: 2875000,
      balanceDifference: -375000, // Kekurangan dana Rp 375.000 (nombok)
      settlementAction: "REIMBURSE_ADDITIONAL",
      status: "PENDING_FINANCE_SETTLEMENT",
      items: [
        { id: "r-91", receiptDate: "19/11/2026", description: "BBM Pertamax & Tol Operasional Tagogapu", vendor: "SPBU Pertamina Tagogapu", receiptNumber: "STR-4412", amount: 750000 },
        { id: "r-92", receiptDate: "20/11/2026", description: "Baut Klem Tiang Tambahan & Hook Suspension", vendor: "Toko Baut Cahaya Teknik", receiptNumber: "NTA-903", amount: 1180000 },
        { id: "r-93", receiptDate: "21/11/2026", description: "Konsumsi & Kopi Lembur Malam Tim Teknisi (4 Orang)", vendor: "Warung Makan Barokah", receiptNumber: "STR-002", amount: 945000 }
      ],
      receiptAttachments: [
        {
          id: "att-lpj-050-1",
          name: "Struk_SPBU_Tagogapu_STR4412.jpg",
          type: "image/jpeg",
          size: 260000,
          dataUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80",
          uploadedAt: "21/11/2026 16:30"
        },
        {
          id: "att-lpj-050-2",
          name: "Nota_Cahaya_Teknik_NTA903.jpg",
          type: "image/jpeg",
          size: 340000,
          dataUrl: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600&auto=format&fit=crop&q=80",
          uploadedAt: "21/11/2026 16:32"
        },
        {
          id: "att-lpj-050-3",
          name: "Struk_Warung_Barokah_STR002.jpg",
          type: "image/jpeg",
          size: 185000,
          dataUrl: "https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=600&auto=format&fit=crop&q=80",
          uploadedAt: "21/11/2026 16:35"
        }
      ],
      auditNotes: "Fisik nota lengkap & sah. Terdapat kelebihan pengeluaran riil Rp 375.000 yang ditanggung teknisi.",
      pmNotes: "Disetujui. Pekerjaan selesai sesuai target cluster baru.",
      gmNotes: "Disetujui. Diteruskan ke Finance untuk proses reimbursement dana talangan Rp 375.000."
    }
  },
  {
    id: "req-010",
    requestNumber: "CA-2026-STAR-055",
    title: "Kasbon Biaya Koordinasi & Permit Jalur FO Padalarang",
    category: "Operasional Permit",
    unit: "Padalarang",
    costCenterId: "cc-star-02",
    requesterName: "Agus Pratama",
    requesterRole: "SITE_SPV",
    requestType: "CASH_ADVANCE",
    totalAmount: 1800000,
    status: "DISBURSED",
    purpose: "Biaya koordinasi aparat desa dan konsumsi tim survei perizinan crossing rel kereta api",
    createdAt: "2026-11-22",
    dueDate: "2026-11-29",
    disbursedAt: "2026-11-23",
    items: [
      { id: "itm-21", description: "Biaya Koordinasi Lapangan & Petugas Jalur", quantity: 1, unit: "Paket", estimatedPrice: 1200000, totalPrice: 1200000 },
      { id: "itm-22", description: "Konsumsi Tim Pengawas (2 Hari)", quantity: 2, unit: "Hari", estimatedPrice: 300000, totalPrice: 600000 }
    ],
    disbursement: {
      disbursedAt: "2026-11-23",
      disbursedBy: "Dewi Anggraeni (Finance)",
      voucherNumber: "BKK-2026-11-055",
      sourceAccount: "Bank BCA Operasional (A/C: 731-0982-11)",
      paymentMethod: "TRANSFER_BANK",
      transferReference: "TRF-BCA-9812455",
      amountPaid: 1800000
    }
    // realization is undefined -> Belum dilaporkan LPJ-nya!
  }
];

export const INITIAL_SUBSCRIBERS: StarliteSubscriber[] = [
  {
    id: "sub-001",
    customerNumber: "STL-2026-0001",
    fullName: "Bambang Sudibyo",
    phone: "081234567890",
    address: "Jl. Dahlia No. 12, Cluster Sentul",
    cluster: "Sentul City",
    odpCode: "ODP-STL-04/02",
    packagePlan: "Starlite Home 50 Mbps",
    monthlyFee: 299000,
    status: "ACTIVE",
    installedAt: "2026-09-15",
    billingDueDay: 10,
  },
  {
    id: "sub-002",
    customerNumber: "STL-2026-0002",
    fullName: "Indah Permatasari",
    phone: "081398765432",
    address: "Jl. Mawar Raya No. 45, Cluster Sentul",
    cluster: "Sentul City",
    odpCode: "ODP-STL-04/05",
    packagePlan: "Starlite Home 100 Mbps",
    monthlyFee: 449000,
    status: "ACTIVE",
    installedAt: "2026-10-01",
    billingDueDay: 10,
  },
  {
    id: "sub-003",
    customerNumber: "STL-2026-0003",
    fullName: "CV. Abadi Surya (SOHO)",
    phone: "082111223344",
    address: "Ruko Sentul Niaga Blok B-03",
    cluster: "Sentul City",
    odpCode: "ODP-STL-02/01",
    packagePlan: "Starlite Business 200 Mbps",
    monthlyFee: 1250000,
    status: "ACTIVE",
    installedAt: "2026-10-20",
    billingDueDay: 15,
  }
];

export const INITIAL_INVOICES: StarliteInvoice[] = [
  {
    id: "inv-001",
    invoiceNumber: "INV-STL-2611-001",
    subscriberId: "sub-001",
    subscriberName: "Bambang Sudibyo",
    periodMonth: "2026-11",
    amount: 299000,
    dueDate: "2026-11-10",
    paymentStatus: "PAID",
    paidAt: "2026-11-08",
    paymentMethod: "TRANSFER_BCA"
  },
  {
    id: "inv-002",
    invoiceNumber: "INV-STL-2611-002",
    subscriberId: "sub-002",
    subscriberName: "Indah Permatasari",
    periodMonth: "2026-11",
    amount: 449000,
    dueDate: "2026-11-10",
    paymentStatus: "PAID",
    paidAt: "2026-11-09",
    paymentMethod: "TRANSFER_MANDIRI"
  },
  {
    id: "inv-003",
    invoiceNumber: "INV-STL-2611-003",
    subscriberId: "sub-003",
    subscriberName: "CV. Abadi Surya (SOHO)",
    periodMonth: "2026-11",
    amount: 1250000,
    dueDate: "2026-11-15",
    paymentStatus: "OVERDUE"
  }
];

// B2B & B2C Integrated Sales Invoices (Faktur Penjualan & Piutang Proyek / FTTH)
export const INITIAL_SALES_INVOICES: SalesInvoice[] = [
  {
    id: "inv-sales-001",
    invoiceNumber: "INV-2026-ME-001",
    clientName: "PT. Astra Otoparts Tbk (Kawasan Industri KIIC)",
    clientAddress: "Jl. Permata Raya Lot CA-4, KIIC Karawang Barat",
    clientNPWP: "01.342.891.4-054.000",
    clientPhone: "(0267) 845-2100",
    contractNumber: "SPK-2026-ME-01",
    unit: "ME_CORE",
    title: "Termin I (30%) - Pekerjaan Instalasi Panel Incoming & Kabel Power",
    description: "Pembayaran Termin 1 sesuai Berita Acara Progres Fisik No. BAKP-ME-2026-004",
    invoiceDate: "2026-11-01",
    dueDate: "2026-11-15",
    progressPercent: 35,
    dppAmount: 120000000,
    ppnPercent: 11,
    ppnAmount: 13200000,
    pph23Percent: 2,
    pph23Amount: 2400000,
    totalAmount: 130800000,
    paidAmount: 130800000,
    status: "PAID_FULL",
    targetBankAccount: "Bank Mandiri (A/C: 133-00-981240-8 a.n. PT Jayahana Manaura Mekanika Selaras)",
    auditProgressNote: "Fisik instalasi panel incoming telah dicek dan memenuhi standar teknis 35% opname.",
    financeTaxNote: "Faktur pajak PPN 11% dan bukti potong PPh 23 (2%) telah divalidasi.",
    directorApprovalDate: "2026-11-02",
    payments: [
      {
        paymentId: "pay-001",
        paymentDate: "2026-11-08",
        amountPaid: 130800000,
        voucherNumber: "BKM-2026-11-001",
        bankAccount: "Bank Mandiri Operasional (A/C: 133-00-981240-8)",
        paymentMethod: "TRANSFER_BANK",
        referenceNote: "Pelunasan Termin I Proyek KIIC via Bank Mandiri",
        receivedBy: "Dewi Anggraeni (Finance Head)"
      }
    ]
  },
  {
    id: "inv-sales-002",
    invoiceNumber: "INV-2026-ME-002",
    clientName: "PT. Menara Sentul Land (Gedung Sentul Tower)",
    clientAddress: "Jl. MH Thamrin Blok C-02, Sentul City, Bogor",
    clientNPWP: "02.891.123.6-403.000",
    clientPhone: "(021) 8792-5500",
    contractNumber: "SPK-2026-ME-08",
    unit: "ME_CORE",
    title: "Termin II (40%) - Instalasi Pemipaan Chiller & Pengkabelan Feeder",
    description: "Pembayaran Termin 2 pekerjaan mekanikal pendingin gedung lantai 1-5",
    invoiceDate: "2026-11-10",
    dueDate: "2026-11-25",
    progressPercent: 65,
    dppAmount: 85000000,
    ppnPercent: 11,
    ppnAmount: 9350000,
    pph23Percent: 2,
    pph23Amount: 1700000,
    totalAmount: 92650000,
    paidAmount: 0,
    status: "APPROVED_ISSUED",
    targetBankAccount: "Bank BCA (A/C: 731-0982-11 a.n. PT Jayahana Manaura Mekanika Selaras)",
    auditProgressNote: "Opname fisik chiller pipa dan uji tekanan hidrostatik pipa telah lolos uji.",
    financeTaxNote: "Invoice B2B telah terverifikasi, menunggu pembayaran jatuh tempo 25 Nov 2026.",
    directorApprovalDate: "2026-11-11"
  },
  {
    id: "inv-sales-003",
    invoiceNumber: "INV-2026-STAR-088",
    clientName: "CV. Abadi Surya (SOHO)",
    clientAddress: "Ruko Sentul Niaga Blok B-03, Sentul City",
    clientNPWP: "03.441.980.1-403.000",
    clientPhone: "082111223344",
    contractNumber: "SUB-2026-STL-003",
    unit: "STARLITE_FTTH",
    title: "Langganan Internet Dedicated Starlite Business 200 Mbps (Nov 2026)",
    description: "Iuran bulanan koneksi internet fiber optik + 1 Static IP Public",
    invoiceDate: "2026-11-01",
    dueDate: "2026-11-15",
    dppAmount: 1250000,
    ppnPercent: 11,
    ppnAmount: 137500,
    totalAmount: 1387500,
    paidAmount: 0,
    status: "OVERDUE",
    targetBankAccount: "Bank BCA (A/C: 731-0982-11 a.n. PT Jayahana Manaura Mekanika Selaras)",
    financeTaxNote: "Lewat jatuh tempo 3 hari, reminder penagihan telah dikirim via WhatsApp."
  },
  {
    id: "inv-sales-004",
    invoiceNumber: "INV-2026-STAR-092",
    clientName: "Pengelola Warga Cluster Sentul Tahap 2 (Kolektif)",
    clientAddress: "Kantor Pengelola RT/RW Cluster Sentul City",
    clientPhone: "081299887766",
    contractNumber: "TAGIHAN-FTTH-RES-2611",
    unit: "STARLITE_FTTH",
    title: "Tagihan Kolektif 28 Pelanggan Residensial Starlite FTTH (Nov 2026)",
    description: "Iuran internet rumah tangga paket 50 Mbps & 100 Mbps cluster Sentul",
    invoiceDate: "2026-11-05",
    dueDate: "2026-11-20",
    dppAmount: 8850000,
    ppnPercent: 11,
    ppnAmount: 973500,
    totalAmount: 9823500,
    paidAmount: 9823500,
    status: "PAID_FULL",
    targetBankAccount: "Bank BCA (A/C: 731-0982-11 a.n. PT Jayahana Manaura Mekanika Selaras)",
    payments: [
      {
        paymentId: "pay-002",
        paymentDate: "2026-11-14",
        amountPaid: 9823500,
        voucherNumber: "BKM-2026-11-002",
        bankAccount: "Bank BCA (A/C: 731-0982-11)",
        paymentMethod: "TRANSFER_BANK",
        referenceNote: "Pelunasan tagihan kolektif FTTH Cluster Sentul Tahap 2",
        receivedBy: "Dewi Anggraeni (Finance Head)"
      }
    ]
  },
  {
    id: "inv-sales-005",
    invoiceNumber: "INV-2026-ME-003",
    clientName: "PT. Cipta Graha Mandiri (Mall Cibinong)",
    clientAddress: "Jl. Raya Jakarta-Bogor Km. 42, Cibinong",
    clientNPWP: "01.772.331.2-403.000",
    clientPhone: "(021) 875-9900",
    contractNumber: "SPK-2026-ME-14",
    unit: "ME_CORE",
    title: "Termin I (20%) - Pengadaan & Penarikan Kabel Feeder Mall Cibinong",
    description: "Uang muka kerja & pengadaan kabel NYFGBY 4x95mm feeder trafo mall",
    invoiceDate: "2026-11-17",
    dueDate: "2026-12-02",
    progressPercent: 20,
    dppAmount: 45000000,
    ppnPercent: 11,
    ppnAmount: 4950000,
    pph23Percent: 2,
    pph23Amount: 900000,
    totalAmount: 49050000,
    paidAmount: 0,
    status: "PENDING_AUDIT_PROGRESS",
    targetBankAccount: "Bank Mandiri (A/C: 133-00-981240-8 a.n. PT Jayahana Manaura Mekanika Selaras)",
    auditProgressNote: "Menunggu Berita Acara Opname Fisik lapangan dari Site Manager & Tim Audit."
  }
];

export const INITIAL_RECEIPTS_BKM: OfficialReceiptBKM[] = [
  {
    id: "bkm-001",
    receiptNumber: "BKM-2026-11-001",
    invoiceNumber: "INV-2026-ME-001",
    clientName: "PT. Astra Otoparts Tbk (Kawasan Industri KIIC)",
    amountReceived: 130800000,
    receivedDate: "2026-11-08",
    paymentMethod: "Transfer Bank Mandiri",
    bankTarget: "Bank Mandiri Operasional (A/C: 133-00-981240-8)",
    forPaymentOf: "Pelunasan Termin I (30%) Pekerjaan Instalasi Panel & Kabel Pabrik KIIC (SPK-2026-ME-01)",
    cashierName: "Siti Rahmawati (Kasir)",
    authorizedBy: "Dewi Anggraeni, SE (Finance Head)"
  },
  {
    id: "bkm-002",
    receiptNumber: "BKM-2026-11-002",
    invoiceNumber: "INV-2026-STAR-092",
    clientName: "Pengelola Warga Cluster Sentul Tahap 2 (Kolektif)",
    amountReceived: 9823500,
    receivedDate: "2026-11-14",
    paymentMethod: "Transfer Bank BCA",
    bankTarget: "Bank BCA Operasional (A/C: 731-0982-11)",
    forPaymentOf: "Pelunasan Tagihan Kolektif 28 Pelanggan Residensial Starlite FTTH Periode November 2026",
    cashierName: "Siti Rahmawati (Kasir)",
    authorizedBy: "Dewi Anggraeni, SE (Finance Head)"
  }
];

// Recent Multi-Channel Transactions (Income & Expense)
export const INITIAL_TRANSACTIONS: FinancialTransaction[] = [
  {
    id: "tx-001",
    transactionNumber: "TX-IN-20261118-01",
    date: "2026-11-18",
    description: "Pembayaran Termin II Proyek Mekanikal & Elektrikal Pabrik KIIC",
    unit: "ME_CORE",
    type: "INCOME",
    category: "Termin Kontrak Jasa ME",
    amount: 175000000,
    status: "COMPLETED",
    paymentMethod: "Bank Mandiri (VA)",
    recipientOrPayer: "PT. Global Chemindo Industri (Klien)"
  },
  {
    id: "tx-002",
    transactionNumber: "TX-OUT-20261117-02",
    date: "2026-11-17",
    description: "Pengadaan Kabel Fiber Optik Drop Core 1000m & Splitter PLC ODP",
    unit: "STARLITE_FTTH",
    type: "EXPENSE",
    category: "Capex Rollout Jaringan",
    amount: 14200000,
    status: "COMPLETED",
    paymentMethod: "Bank BCA Bisnis",
    recipientOrPayer: "PT. Fiberindo Mandiri Sukses"
  },
  {
    id: "tx-003",
    transactionNumber: "TX-IN-20261116-03",
    date: "2026-11-16",
    description: "Penerimaan Tagihan Internet Starlite Cluster Sentul (Batch 1)",
    unit: "STARLITE_FTTH",
    type: "INCOME",
    category: "Pendapatan Langganan FTTH",
    amount: 8640000,
    status: "COMPLETED",
    paymentMethod: "Payment Gateway QRIS/BCA",
    recipientOrPayer: "18 Pelanggan Residensial"
  },
  {
    id: "tx-004",
    transactionNumber: "TX-OUT-20261115-04",
    date: "2026-11-15",
    description: "Kas Bon Operasional Penarikan Kabel Feeder OLT Sentul",
    unit: "STARLITE_FTTH",
    type: "EXPENSE",
    category: "Kas Bon Operasional",
    amount: 3500000,
    status: "COMPLETED",
    paymentMethod: "Kas Bon Kasir Lapangan",
    recipientOrPayer: "Rudi Haryanto (Teknisi)"
  },
  {
    id: "tx-005",
    transactionNumber: "TX-OUT-20261114-05",
    date: "2026-11-14",
    description: "Beban Upstream Bandwidth 1 Gbps Dedicated Dedicated Internet",
    unit: "STARLITE_FTTH",
    type: "EXPENSE",
    category: "Opex Bandwidth Upstream",
    amount: 18500000,
    status: "COMPLETED",
    paymentMethod: "Bank BCA",
    recipientOrPayer: "PT. Lintas Data Jaringan (NAP)"
  },
  {
    id: "tx-006",
    transactionNumber: "TX-OUT-20261112-06",
    date: "2026-11-12",
    description: "Pembelian MCB Schneider & Panel Distribusi Proyek Menara",
    unit: "ME_CORE",
    type: "EXPENSE",
    category: "Material Proyek",
    amount: 22800000,
    status: "COMPLETED",
    paymentMethod: "Transfer Mandiri",
    recipientOrPayer: "Toko Sinar Elektrik Jaya"
  },
  {
    id: "tx-007",
    transactionNumber: "TX-IN-20261110-07",
    date: "2026-11-10",
    description: "Biaya Pasang Baru (PSB) Pelanggan Bisnis Sentul Niaga",
    unit: "STARLITE_FTTH",
    type: "INCOME",
    category: "Pendapatan PSB & Registrasi",
    amount: 2500000,
    status: "COMPLETED",
    paymentMethod: "Transfer BCA",
    recipientOrPayer: "CV. Abadi Surya"
  },
  {
    id: "tx-008",
    transactionNumber: "TX-OUT-20261108-08",
    date: "2026-11-08",
    description: "Utilitas Kantor Pusat, Internet Backup, & Konsumsi Meeting",
    unit: "OVERHEAD_OPERASIONAL",
    type: "EXPENSE",
    category: "Overhead Umum & GA",
    amount: 6750000,
    status: "COMPLETED",
    paymentMethod: "Petty Cash Kantor",
    recipientOrPayer: "Divisi GA & HR"
  }
];

// Historical Monthly Summary Data for Filtering (2024, 2025, 2026)
export const HISTORICAL_FINANCIAL_DATA: MonthlyFinancialSummary[] = [
  // Tahun 2026
  { month: "Jan", monthNum: 1, year: 2026, income: 145000000, expense: 98000000, meExpense: 65000000, ftthExpense: 23000000, overheadExpense: 10000000 },
  { month: "Feb", monthNum: 2, year: 2026, income: 160000000, expense: 112000000, meExpense: 72000000, ftthExpense: 28000000, overheadExpense: 12000000 },
  { month: "Mar", monthNum: 3, year: 2026, income: 185000000, expense: 130000000, meExpense: 85000000, ftthExpense: 33000000, overheadExpense: 12000000 },
  { month: "Apr", monthNum: 4, year: 2026, income: 170000000, expense: 125000000, meExpense: 80000000, ftthExpense: 32000000, overheadExpense: 13000000 },
  { month: "Mei", monthNum: 5, year: 2026, income: 210000000, expense: 148000000, meExpense: 95000000, ftthExpense: 40000000, overheadExpense: 13000000 },
  { month: "Jun", monthNum: 6, year: 2026, income: 230000000, expense: 165000000, meExpense: 105000000, ftthExpense: 45000000, overheadExpense: 15000000 },
  { month: "Jul", monthNum: 7, year: 2026, income: 245000000, expense: 172000000, meExpense: 110000000, ftthExpense: 47000000, overheadExpense: 15000000 },
  { month: "Agu", monthNum: 8, year: 2026, income: 260000000, expense: 188000000, meExpense: 115000000, ftthExpense: 58000000, overheadExpense: 15000000 },
  { month: "Sep", monthNum: 9, year: 2026, income: 290000000, expense: 205000000, meExpense: 125000000, ftthExpense: 64000000, overheadExpense: 16000000 },
  { month: "Okt", monthNum: 10, year: 2026, income: 310000000, expense: 220000000, meExpense: 130000000, ftthExpense: 72000000, overheadExpense: 18000000 },
  { month: "Nov", monthNum: 11, year: 2026, income: 285000000, expense: 195000000, meExpense: 118000000, ftthExpense: 61000000, overheadExpense: 16000000 },
  { month: "Des", monthNum: 12, year: 2026, income: 340000000, expense: 235000000, meExpense: 140000000, ftthExpense: 75000000, overheadExpense: 20000000 },

  // Tahun 2025
  { month: "Jan", monthNum: 1, year: 2025, income: 110000000, expense: 80000000, meExpense: 55000000, ftthExpense: 15000000, overheadExpense: 10000000 },
  { month: "Feb", monthNum: 2, year: 2025, income: 125000000, expense: 90000000, meExpense: 65000000, ftthExpense: 15000000, overheadExpense: 10000000 },
  { month: "Mar", monthNum: 3, year: 2025, income: 140000000, expense: 102000000, meExpense: 75000000, ftthExpense: 17000000, overheadExpense: 10000000 },
  { month: "Apr", monthNum: 4, year: 2025, income: 135000000, expense: 98000000, meExpense: 70000000, ftthExpense: 18000000, overheadExpense: 10000000 },
  { month: "Mei", monthNum: 5, year: 2025, income: 150000000, expense: 110000000, meExpense: 80000000, ftthExpense: 19000000, overheadExpense: 11000000 },
  { month: "Jun", monthNum: 6, year: 2025, income: 165000000, expense: 120000000, meExpense: 85000000, ftthExpense: 23000000, overheadExpense: 12000000 },
  { month: "Jul", monthNum: 7, year: 2025, income: 175000000, expense: 128000000, meExpense: 90000000, ftthExpense: 26000000, overheadExpense: 12000000 },
  { month: "Agu", monthNum: 8, year: 2025, income: 180000000, expense: 135000000, meExpense: 95000000, ftthExpense: 28000000, overheadExpense: 12000000 },
  { month: "Sep", monthNum: 9, year: 2025, income: 195000000, expense: 142000000, meExpense: 100000000, ftthExpense: 30000000, overheadExpense: 12000000 },
  { month: "Okt", monthNum: 10, year: 2025, income: 210000000, expense: 155000000, meExpense: 110000000, ftthExpense: 32000000, overheadExpense: 13000000 },
  { month: "Nov", monthNum: 11, year: 2025, income: 220000000, expense: 160000000, meExpense: 112000000, ftthExpense: 34000000, overheadExpense: 14000000 },
  { month: "Des", monthNum: 12, year: 2025, income: 240000000, expense: 178000000, meExpense: 120000000, ftthExpense: 42000000, overheadExpense: 16000000 },

  // Tahun 2024
  { month: "Jan", monthNum: 1, year: 2024, income: 80000000, expense: 60000000, meExpense: 48000000, ftthExpense: 5000000, overheadExpense: 7000000 },
  { month: "Feb", monthNum: 2, year: 2024, income: 85000000, expense: 64000000, meExpense: 51000000, ftthExpense: 6000000, overheadExpense: 7000000 },
  { month: "Mar", monthNum: 3, year: 2024, income: 95000000, expense: 70000000, meExpense: 56000000, ftthExpense: 6000000, overheadExpense: 8000000 },
  { month: "Apr", monthNum: 4, year: 2024, income: 90000000, expense: 68000000, meExpense: 54000000, ftthExpense: 6000000, overheadExpense: 8000000 },
  { month: "Mei", monthNum: 5, year: 2024, income: 100000000, expense: 75000000, meExpense: 60000000, ftthExpense: 7000000, overheadExpense: 8000000 },
  { month: "Jun", monthNum: 6, year: 2024, income: 110000000, expense: 82000000, meExpense: 66000000, ftthExpense: 8000000, overheadExpense: 8000000 },
  { month: "Jul", monthNum: 7, year: 2024, income: 115000000, expense: 85000000, meExpense: 68000000, ftthExpense: 9000000, overheadExpense: 8000000 },
  { month: "Agu", monthNum: 8, year: 2024, income: 120000000, expense: 89000000, meExpense: 71000000, ftthExpense: 10000000, overheadExpense: 8000000 },
  { month: "Sep", monthNum: 9, year: 2024, income: 130000000, expense: 95000000, meExpense: 76000000, ftthExpense: 10000000, overheadExpense: 9000000 },
  { month: "Okt", monthNum: 10, year: 2024, income: 135000000, expense: 99000000, meExpense: 78000000, ftthExpense: 11000000, overheadExpense: 10000000 },
  { month: "Nov", monthNum: 11, year: 2024, income: 140000000, expense: 102000000, meExpense: 80000000, ftthExpense: 12000000, overheadExpense: 10000000 },
  { month: "Des", monthNum: 12, year: 2024, income: 150000000, expense: 112000000, meExpense: 88000000, ftthExpense: 13000000, overheadExpense: 11000000 }
];

// Pending Approvals Queue (Budget Requests & LPJ Realizations)
export interface PendingApprovalItem {
  id: string;
  type: 'BUDGET_REQUEST' | 'LPJ_REALIZATION';
  docNumber: string;
  title: string;
  unit: BusinessUnit;
  requester: string;
  amount: number;
  submittedAt: string;
  level: string; // e.g. "SPV Operasional", "Finance / Kasir", "Direksi"
  urgent: boolean;
}

export const INITIAL_PENDING_APPROVALS: PendingApprovalItem[] = [
  {
    id: "appr-01",
    type: "BUDGET_REQUEST",
    docNumber: "CA-2026-STAR-042",
    title: "Kas Bon Operasional Penarikan Kabel ODP Sentul",
    unit: "STARLITE_FTTH",
    requester: "Rudi Haryanto (Teknisi Lapangan)",
    amount: 3500000,
    submittedAt: "2026-11-16",
    level: "Finance / Kasir",
    urgent: true
  },
  {
    id: "appr-02",
    type: "BUDGET_REQUEST",
    docNumber: "PR-2026-ME-020",
    title: "Pengadaan Pipa Konduit & Cable Tray Gedung Menara",
    unit: "ME_CORE",
    requester: "Agus Pratama (Site SPV)",
    amount: 14750000,
    submittedAt: "2026-11-17",
    level: "Division Head ME",
    urgent: false
  },
  {
    id: "appr-03",
    type: "LPJ_REALIZATION",
    docNumber: "LPJ-2026-ME-015",
    title: "LPJ Pembelian Solar Genset Proyek KIIC (Nota Terlampir)",
    unit: "ME_CORE",
    requester: "Sandi Kurnia (Logistik)",
    amount: 5200000,
    submittedAt: "2026-11-17",
    level: "Verifikasi Kasir",
    urgent: true
  },
  {
    id: "appr-04",
    type: "LPJ_REALIZATION",
    docNumber: "LPJ-2026-STAR-039",
    title: "LPJ Splicer Maintenance & Transport Teknisi",
    unit: "STARLITE_FTTH",
    requester: "Fajar Nugraha (Teknisi FTTH)",
    amount: 2800000,
    submittedAt: "2026-11-18",
    level: "Verifikasi Kasir",
    urgent: false
  }
];

// Division Budget Capaian Data Helper per Year
export const DIVISION_BUDGET_YEARS: Record<number, Array<{
  unit: BusinessUnit;
  name: string;
  code: string;
  pagu: number;
  terpakai: number;
  terencana: number;
  iconName: string;
  color: string;
}>> = {
  2026: [
    {
      unit: "ME_CORE",
      name: "Divisi Jasa Mekanik & Elektronik (ME)",
      code: "DIV-ME",
      pagu: 850000000,
      terpakai: 625000000,
      terencana: 120000000,
      iconName: "Building2",
      color: "blue"
    },
    {
      unit: "STARLITE_FTTH",
      name: "Divisi Ekspansi Starlite FTTH",
      code: "DIV-STARLITE",
      pagu: 950000000,
      terpakai: 742000000,
      terencana: 150000000,
      iconName: "Wifi",
      color: "fuchsia"
    },
    {
      unit: "OVERHEAD_OPERASIONAL",
      name: "Divisi Operasional & Umum (GA/HR)",
      code: "DIV-OPS",
      pagu: 220000000,
      terpakai: 165000000,
      terencana: 30000000,
      iconName: "ShieldCheck",
      color: "slate"
    }
  ],
  2025: [
    {
      unit: "ME_CORE",
      name: "Divisi Jasa Mekanik & Elektronik (ME)",
      code: "DIV-ME",
      pagu: 720000000,
      terpakai: 680000000,
      terencana: 20000000,
      iconName: "Building2",
      color: "blue"
    },
    {
      unit: "STARLITE_FTTH",
      name: "Divisi Ekspansi Starlite FTTH",
      code: "DIV-STARLITE",
      pagu: 500000000,
      terpakai: 460000000,
      terencana: 25000000,
      iconName: "Wifi",
      color: "fuchsia"
    },
    {
      unit: "OVERHEAD_OPERASIONAL",
      name: "Divisi Operasional & Umum (GA/HR)",
      code: "DIV-OPS",
      pagu: 180000000,
      terpakai: 162000000,
      terencana: 10000000,
      iconName: "ShieldCheck",
      color: "slate"
    }
  ],
  2024: [
    {
      unit: "ME_CORE",
      name: "Divisi Jasa Mekanik & Elektronik (ME)",
      code: "DIV-ME",
      pagu: 550000000,
      terpakai: 512000000,
      terencana: 15000000,
      iconName: "Building2",
      color: "blue"
    },
    {
      unit: "STARLITE_FTTH",
      name: "Divisi Ekspansi Starlite FTTH",
      code: "DIV-STARLITE",
      pagu: 200000000,
      terpakai: 185000000,
      terencana: 10000000,
      iconName: "Wifi",
      color: "fuchsia"
    },
    {
      unit: "OVERHEAD_OPERASIONAL",
      name: "Divisi Operasional & Umum (GA/HR)",
      code: "DIV-OPS",
      pagu: 140000000,
      terpakai: 132000000,
      terencana: 5000000,
      iconName: "ShieldCheck",
      color: "slate"
    }
  ]
};

// Accurate-Style ERP Widgets Data
export const WEEKLY_SALES_TREND = [
  { day: "Kam", date: "12 Nov", value: 14500000 },
  { day: "Jum", date: "13 Nov", value: 22000000 },
  { day: "Sab", date: "14 Nov", value: 9200000 },
  { day: "Min", date: "15 Nov", value: 4500000 },
  { day: "Sen", date: "16 Nov", value: 38500000 },
  { day: "Kemarin", date: "17 Nov", value: 42000000 },
  { day: "Hari ini", date: "18 Nov", value: 55440000 },
];

export const ANNUAL_PROFIT_LOSS_ACCURATE = {
  periodLabel: "1 Jan - 18 Nov 2026",
  pendapatan: 2470000000,
  hpp: 1180000000,
  pengeluaran: 485000000,
  labaBersih: 805000000,
  profitMarginPercent: 32.6,
  bandingTahunLalu: 620000000, // 2025: 620 jt
  pertumbuhanPercent: 29.8
};

export const COMPANY_EXPENSE_ACCURATE = {
  periodLabel: "1 Nov - 18 Nov 2026",
  totalBeban: 114250000,
  breakdown: [
    { name: "Material & Kabel ME", amount: 48500000, percent: 42.5 },
    { name: "Bandwidth & OLT FTTH", amount: 32700000, percent: 28.6 },
    { name: "Gaji & Lembur Teknisi", amount: 22000000, percent: 19.3 },
    { name: "Operasional & GA", amount: 11050000, percent: 9.6 }
  ],
  bandingBulanLalu: 128000000,
  efisiensiPercent: 10.7
};

export const SALES_SUMMARY_ACCURATE = {
  periodLabel: "1 Nov - 18 Nov 2026",
  pendapatan: 186140000,
  hariIni: 55440000,
  belumLunas: 42500000,
  fakturLunas: 143640000,
  belumJatuhTempo: 33500000,
  lewatJatuhTempo: 9000000
};

export const PURCHASE_SUMMARY_ACCURATE = {
  periodLabel: "1 Nov - 18 Nov 2026",
  pembelian: 84600000,
  hariIni: 14200000,
  belumLunas: 21000000,
  fakturLunas: 63600000,
  belumJatuhTempo: 17500000,
  lewatJatuhTempo: 3500000
};

export const USER_ACTIVITY_ACCURATE = {
  userName: "Sidqi Alaudin Johari",
  todayDate: "18 Nov",
  lastActivityTime: "05:35",
  lastActivityDesc: "Buat Preferensi & Konfigurasi Sistem",
  upcomingEvents: [
    { id: "ev-1", date: "20 Nov 2026", title: "Roll-out ODP Cluster Sentul City Tahap 3", division: "STARLITE_FTTH" },
    { id: "ev-2", date: "22 Nov 2026", title: "Testing Panel Listrik & Pipa ME Proyek KIIC", division: "ME_CORE" },
    { id: "ev-3", date: "25 Nov 2026", title: "Jatuh Tempo Faktur Termin II Gedung Menara", division: "ME_CORE" }
  ]
};


