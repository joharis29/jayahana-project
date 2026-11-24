"use client";

import React from "react";
import { Printer, X, CheckCircle2, AlertTriangle, ShieldCheck, FileText, Building2, Wifi, Paperclip } from "lucide-react";
import type { BudgetRequest, GoodsReceiptRecord, RealizationRecord, SalesInvoice, OfficialReceiptBKM } from "@/types";

interface PrintableDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  request?: BudgetRequest;
  invoice?: SalesInvoice;
  receipt?: OfficialReceiptBKM;
  docType: "REQUEST" | "DISBURSEMENT" | "REALIZATION" | "GOODS_RECEIPT" | "SALES_INVOICE" | "OFFICIAL_RECEIPT" | "PROGRESS_REPORT";
}

export function PrintableDocumentModal({
  isOpen,
  onClose,
  request,
  invoice,
  receipt,
  docType,
}: PrintableDocumentModalProps) {
  if (!isOpen) return null;

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num);
  };

  const handlePrint = () => {
    window.print();
  };

  const activeUnit = invoice ? invoice.unit : (request ? request.unit : "ME_CORE");
  const unitName = 
    activeUnit === "ME_CORE" 
      ? "Divisi Mekanikal & Elektrikal (ME Core)" 
      : activeUnit === "STARLITE_FTTH" 
      ? "Divisi Starlite FTTH (Fiber Optic)" 
      : activeUnit === "OVERHEAD_OPERASIONAL"
      ? "Divisi Operasional & Umum"
      : String(activeUnit);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      {/* Container Dialog */}
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-8 flex flex-col max-h-[92vh] overflow-hidden border border-slate-200">
        
        {/* Top Control Bar (Hidden on print) */}
        <div className="print:hidden flex justify-between items-center px-6 py-4 bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Printer className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-100">Pratinjau Cetak Formulir Dokumen Resmi</h2>
              <p className="text-xs text-slate-400">
                PT. Jayahana Manaura Mekanika Selaras &bull; Format Standar A4
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Cetak / Simpan PDF
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Paper Area (A4 Styled) */}
        <div className="flex-1 overflow-y-auto p-8 bg-slate-100 print:bg-white print:p-0">
          <div className="bg-white max-w-[210mm] mx-auto p-8 border border-slate-200 shadow-sm rounded-lg print:shadow-none print:border-none print:p-6 print:max-w-none text-slate-800 font-sans">
            
            {/* KOP SURAT RESMI */}
            <div className="border-b-2 border-slate-800 pb-4 mb-6">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-xl font-black tracking-tight text-slate-900 uppercase">
                    PT. Jayahana Manaura Mekanika Selaras
                  </h1>
                  <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide">
                    Mechanical, Electrical Engineering Services & Ecosystem Starlite FTTH
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Sentul City Business District, Jl. MH Thamrin Blok B-08, Sentul, Bogor &bull; Telp: (021) 8792-8812 &bull; Email: finance@jayahana.co.id
                  </p>
                </div>
                <div className="text-right">
                  <div className="inline-block px-3 py-1 bg-slate-100 border border-slate-300 rounded text-xs font-mono font-bold text-slate-800">
                    FORM ISO-FIN-2026
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 font-mono">
                    Doc ID: {invoice ? invoice.invoiceNumber : (request ? request.requestNumber : "DOC-2026")}
                  </div>
                </div>
              </div>
            </div>

            {/* DOKUMEN 1: FORMULIR PENGAJUAN ANGGARAN & PENGADAAN */}
            {docType === "REQUEST" && request && (
              <div>
                <div className="text-center mb-6">
                  <h2 className="text-base font-extrabold uppercase underline tracking-wider text-slate-900">
                    Formulir Pengajuan {request.requestType === "CASH_ADVANCE" ? "Kas Bon Operasional" : "Pesanan Pengadaan (Purchase Requisition)"}
                  </h2>
                  <span className="text-xs text-slate-500 font-mono">Nomor Dokumen: {request.requestNumber}</span>
                </div>

                {/* Metadata Ringkasan */}
                <div className="grid grid-cols-2 gap-4 text-xs mb-6 border border-slate-200 rounded-lg p-3 bg-slate-50">
                  <div className="space-y-1">
                    <div><span className="text-slate-500">Site / Divisi:</span> <strong>{unitName}</strong></div>
                    <div><span className="text-slate-500">Pemohon (Requester):</span> <strong>{request.requesterName}</strong> ({request.requesterRole})</div>
                    <div><span className="text-slate-500">Peruntukan Proyek:</span> <strong>{request.title}</strong></div>
                  </div>
                  <div className="space-y-1">
                    <div><span className="text-slate-500">Tanggal Pengajuan:</span> <strong>{request.createdAt}</strong></div>
                    {request.dueDate && (
                      <div><span className="text-slate-500">Tgl Jatuh Tempo:</span> <strong className="text-amber-900 font-mono">{request.dueDate}</strong></div>
                    )}
                    <div><span className="text-slate-500">Kategori Pengajuan:</span> <strong>{request.category || (request.requestType === "CASH_ADVANCE" ? "Kas Bon Operasional" : "Pembelian Barang / PO")}</strong></div>
                    <div><span className="text-slate-500">Status Persetujuan:</span> <strong className="text-blue-700">{request.status}</strong></div>
                  </div>
                </div>

                {/* Tujuan / Deskripsi */}
                <div className="text-xs mb-4">
                  <span className="font-bold text-slate-700 block mb-1">Catatan / Keterangan:</span>
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded text-slate-800 italic">
                    &ldquo;{request.purpose}&rdquo;
                  </div>
                </div>

                {/* Tabel Rincian Barang / Biaya */}
                <div className="mb-6">
                  <h3 className="text-xs font-bold text-slate-900 uppercase mb-2">Rincian Anggaran / Barang yang Diajukan</h3>
                  <table className="w-full text-xs border border-slate-300 border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 border-b border-slate-300">
                        <th className="border border-slate-300 px-2 py-1.5 text-center w-10">No</th>
                        <th className="border border-slate-300 px-2 py-1.5 text-left">Deskripsi Barang / Biaya</th>
                        <th className="border border-slate-300 px-2 py-1.5 text-center w-16">Kuantitas</th>
                        <th className="border border-slate-300 px-2 py-1.5 text-center w-16">Satuan</th>
                        <th className="border border-slate-300 px-2 py-1.5 text-right w-28">Estimasi Harga</th>
                        <th className="border border-slate-300 px-2 py-1.5 text-right w-32">Total Nominal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(request.procurementItems && request.procurementItems.length > 0 
                        ? request.procurementItems 
                        : request.items
                      ).map((item: any, idx: number) => (
                        <tr key={item.id} className="border-b border-slate-200">
                          <td className="border border-slate-300 px-2 py-1.5 text-center">{idx + 1}</td>
                          <td className="border border-slate-300 px-2 py-1.5">
                            <strong>{item.itemName || item.description}</strong>
                            {item.itemCode && <span className="block text-[10px] text-slate-500 font-mono">Kode: {item.itemCode}</span>}
                          </td>
                          <td className="border border-slate-300 px-2 py-1.5 text-center">{item.quantity}</td>
                          <td className="border border-slate-300 px-2 py-1.5 text-center">{item.unit}</td>
                          <td className="border border-slate-300 px-2 py-1.5 text-right">{formatRupiah(item.unitPrice || item.estimatedPrice || 0)}</td>
                          <td className="border border-slate-300 px-2 py-1.5 text-right font-semibold">{formatRupiah(item.totalPrice)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-slate-50 font-bold border-t-2 border-slate-400">
                        <td colSpan={5} className="border border-slate-300 px-3 py-2 text-right uppercase">
                          Total Anggaran yang Diajukan:
                        </td>
                        <td className="border border-slate-300 px-3 py-2 text-right text-sm text-blue-900">
                          {formatRupiah(request.totalAmount)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Lampiran Dokumen jika ada */}
                {request?.attachments && request.attachments.length > 0 && (
                  <div className="mb-6 p-3 bg-slate-50 border border-slate-300 rounded text-xs">
                    <span className="font-bold text-slate-800 block mb-2">
                      Lampiran Dokumen &amp; Foto ({request.attachments.length} Berkas):
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {request.attachments.map((att) => (
                        <div key={att.id} className="flex items-center gap-1.5 px-2 py-1 bg-white border border-slate-300 rounded text-[10px]">
                          {att.type.startsWith("image/") ? (
                            <img src={att.dataUrl} alt={att.name} className="w-5 h-5 object-cover rounded" />
                          ) : (
                            <FileText className="w-4 h-4 text-red-500" />
                          )}
                          <span className="font-medium text-slate-800 truncate max-w-[220px]">{att.name}</span>
                          <span className="text-slate-400 font-mono">({(att.size / 1024).toFixed(0)}KB)</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Vendor / Rekening Tujuan jika ada */}
                {request.vendorInfo && (
                  <div className="mb-6 p-3 bg-blue-50/50 border border-blue-200 rounded-lg text-xs grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-slate-500 block">Pemasok / Rekening Penerima:</span>
                      <strong>{request.vendorInfo.vendorName}</strong>
                      <span className="block text-[11px] text-slate-600 font-mono">
                        Bank: {request.vendorInfo.bankName} - No: {request.vendorInfo.bankAccountNumber} (a.n. {request.vendorInfo.bankAccountName})
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Syarat Pembayaran & Alamat Kirim:</span>
                      <strong>{request.vendorInfo.paymentTerms || "Cash On Delivery (COD)"}</strong>
                      <span className="block text-[11px] text-slate-600 truncate">{request.vendorInfo.shippingAddress || "Gudang Jayahana Sentul"}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* DOKUMEN 2: FORMULIR BUKTI PENCAIRAN DANA (PAYMENT VOUCHER) */}
            {docType === "DISBURSEMENT" && request && (
              <div>
                <div className="text-center mb-6">
                  <h2 className="text-base font-extrabold uppercase underline tracking-wider text-slate-900">
                    Formulir Bukti Pencairan Kas / Pengeluaran Bank (Payment Voucher)
                  </h2>
                  <span className="text-xs text-slate-500 font-mono">
                    No. Voucher: {request.disbursement?.voucherNumber || `BKK-2026-${request.requestNumber.slice(-3)}`}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs mb-6 border border-slate-200 rounded-lg p-3 bg-emerald-50/40">
                  <div className="space-y-1">
                    <div><span className="text-slate-500">Referensi Pengajuan:</span> <strong>{request.requestNumber}</strong></div>
                    <div><span className="text-slate-500">Site / Divisi Pemohon:</span> <strong>{unitName}</strong></div>
                    <div><span className="text-slate-500">Penerima Dana:</span> <strong>{request.requesterName}</strong> ({request.requesterRole})</div>
                  </div>
                  <div className="space-y-1">
                    <div><span className="text-slate-500">Tanggal Pencairan:</span> <strong>{request.disbursement?.disbursedAt || request.createdAt}</strong></div>
                    <div><span className="text-slate-500">Metode Bayar:</span> <strong>{request.disbursement?.paymentMethod === "TRANSFER_BANK" ? "Transfer Bank" : "Tunai (Kas Kecil Lapangan)"}</strong></div>
                    <div><span className="text-slate-500">Sumber Kas/Bank:</span> <strong>{request.disbursement?.sourceAccount || "Bank BCA Operasional (A/C: 731-0982-11)"}</strong></div>
                  </div>
                </div>

                <div className="my-6 p-4 rounded-xl border-2 border-emerald-500 bg-emerald-50 text-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Jumlah Dana yang Dicairkan</span>
                  <div className="text-2xl font-black text-emerald-900 mt-1">
                    {formatRupiah(request.disbursement?.amountPaid || request.totalAmount)}
                  </div>
                  <span className="text-xs italic text-emerald-700 block mt-1">
                    Keterangan: {request.title} &bull; Ref Transfer: {request.disbursement?.transferReference || "TRF-BCA-981240"}
                  </span>
                </div>

                {/* Lampiran Bukti Transfer / Slip Setoran Bank */}
                {request.disbursement?.proofAttachment && (
                  <div className="my-4 p-3.5 bg-slate-50 border border-slate-300 rounded-lg text-xs">
                    <div className="flex justify-between items-center mb-2 pb-1.5 border-b border-slate-200">
                      <span className="font-bold text-slate-800 flex items-center gap-1.5">
                        <Paperclip className="w-3.5 h-3.5 text-blue-600" />
                        <span>Lampiran Bukti Transfer / Bukti Pembayaran Resmi:</span>
                      </span>
                      <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                        ✓ Bukti Kas Keluar (BKK) Sah &amp; Terverifikasi
                      </span>
                    </div>

                    <div className="flex justify-center items-center py-1">
                      {request.disbursement.proofAttachment.type.startsWith("image/") ? (
                        <div className="border border-slate-300 rounded-lg p-1.5 bg-white shadow-2xs inline-block">
                          <img
                            src={request.disbursement.proofAttachment.dataUrl}
                            alt="Bukti Transfer"
                            className="max-h-60 max-w-full object-contain rounded"
                          />
                        </div>
                      ) : (
                        <div className="p-4 border border-slate-300 rounded-lg bg-white flex items-center gap-2">
                          <FileText className="w-8 h-8 text-red-500 shrink-0" />
                          <div>
                            <span className="font-bold text-slate-900 block">{request.disbursement.proofAttachment.name}</span>
                            <span className="text-[10px] text-slate-400 font-mono">Dokumen Bukti Transfer PDF Terlampir</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* DOKUMEN 3: FORMULIR LAPORAN REALISASI & LPJ */}
            {docType === "REALIZATION" && request && (
              <div>
                <div className="text-center mb-6">
                  <h2 className="text-base font-extrabold uppercase underline tracking-wider text-slate-900">
                    Formulir Laporan Pertanggungjawaban (LPJ) Realisasi Kas Bon
                  </h2>
                  <span className="text-xs text-slate-500 font-mono">
                    No. LPJ: {request.realization?.lpjNumber || `LPJ-2026-${request.requestNumber.slice(-3)}`}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs mb-6 border border-slate-200 rounded-lg p-3 bg-slate-50">
                  <div className="space-y-1">
                    <div><span className="text-slate-500">No. Kas Bon Awal:</span> <strong>{request.requestNumber}</strong></div>
                    <div><span className="text-slate-500">Pelapor / Pemohon:</span> <strong>{request.requesterName}</strong></div>
                    <div><span className="text-slate-500">Site / Divisi:</span> <strong>{unitName}</strong></div>
                  </div>
                  <div className="space-y-1">
                    <div><span className="text-slate-500">Tanggal LPJ:</span> <strong>{request.realization?.submittedAt || "18/11/2026"}</strong></div>
                    <div><span className="text-slate-500">Status Audit LPJ:</span> <strong className="text-emerald-700">{request.realization?.status || "PENDING_AUDIT"}</strong></div>
                    <div><span className="text-slate-500">Uraian Proyek:</span> <strong>{request.title}</strong></div>
                  </div>
                </div>

                {/* Tabel Realisasi Riil */}
                <div className="mb-6">
                  <h3 className="text-xs font-bold text-slate-900 uppercase mb-2">Rincian Pengeluaran Riil Sesuai Nota Fisik</h3>
                  <table className="w-full text-xs border border-slate-300 border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 border-b border-slate-300">
                        <th className="border border-slate-300 px-2 py-1.5 text-center w-10">No</th>
                        <th className="border border-slate-300 px-2 py-1.5 text-center w-24">Tgl Nota</th>
                        <th className="border border-slate-300 px-2 py-1.5 text-left">Uraian Pengeluaran Aktual</th>
                        <th className="border border-slate-300 px-2 py-1.5 text-left w-32">Nama Toko / Vendor</th>
                        <th className="border border-slate-300 px-2 py-1.5 text-center w-24">No. Struk/Nota</th>
                        <th className="border border-slate-300 px-2 py-1.5 text-right w-28">Nominal Riil</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(request.realization?.items && request.realization.items.length > 0 
                        ? request.realization.items 
                        : [
                            { id: "r-1", receiptDate: "16/11/2026", description: "BBM Pertamax Mobil Tangga Lapangan", vendor: "SPBU 34-Sentul", receiptNumber: "STR-0912", amount: 950000 },
                            { id: "r-2", receiptDate: "16/11/2026", description: "Baut Klem Tiang Tambahan", vendor: "Toko Baut Sentul", receiptNumber: "NTA-881", amount: 1420000 },
                            { id: "r-3", receiptDate: "17/11/2026", description: "Konsumsi Lembur Teknisi (4 Orang)", vendor: "RM Sederhana", receiptNumber: "RM-442", amount: 980000 }
                          ]
                      ).map((item, idx) => (
                        <tr key={item.id} className="border-b border-slate-200">
                          <td className="border border-slate-300 px-2 py-1.5 text-center">{idx + 1}</td>
                          <td className="border border-slate-300 px-2 py-1.5 text-center">{item.receiptDate}</td>
                          <td className="border border-slate-300 px-2 py-1.5 font-medium">{item.description}</td>
                          <td className="border border-slate-300 px-2 py-1.5">{item.vendor}</td>
                          <td className="border border-slate-300 px-2 py-1.5 text-center font-mono text-[11px]">{item.receiptNumber}</td>
                          <td className="border border-slate-300 px-2 py-1.5 text-right font-semibold">{formatRupiah(item.amount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Lampiran Dokumen jika ada */}
                {(() => {
                  const attachmentsList = request.realization?.receiptAttachments || request.attachments || [];
                  if (attachmentsList.length === 0) return null;
                  return (
                    <div className="mb-6 p-3 bg-slate-50 border border-slate-300 rounded text-xs">
                      <span className="font-bold text-slate-800 block mb-2">
                        Lampiran Dokumen &amp; Foto Struk Belanja ({attachmentsList.length} Berkas):
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {attachmentsList.map((att) => (
                          <div key={att.id} className="flex items-center gap-1.5 px-2 py-1 bg-white border border-slate-300 rounded text-[10px]">
                            {att.type.startsWith("image/") ? (
                              <img src={att.dataUrl} alt={att.name} className="w-5 h-5 object-cover rounded" />
                            ) : (
                              <FileText className="w-4 h-4 text-red-500" />
                            )}
                            <span className="font-medium text-slate-800 truncate max-w-[220px]">{att.name}</span>
                            <span className="text-slate-400 font-mono">({(att.size / 1024).toFixed(0)}KB)</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                {/* Komparasi Rekonsiliasi Saldo */}
                {(() => {
                  const advance = request.realization?.initialAdvanceAmount || request.totalAmount;
                  const actual = request.realization?.totalRealizedAmount || (advance - 150000);
                  const diff = advance - actual;
                  return (
                    <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 border border-slate-300 rounded-lg text-xs mb-6 text-center">
                      <div className="border-r border-slate-200 pr-2">
                        <span className="text-slate-500 block">Dana Kas Bon Awal:</span>
                        <strong className="text-sm text-slate-800">{formatRupiah(advance)}</strong>
                      </div>
                      <div className="border-r border-slate-200 pr-2">
                        <span className="text-slate-500 block">Total Realisasi Riil:</span>
                        <strong className="text-sm text-slate-800">{formatRupiah(actual)}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block">
                          {diff > 0 ? "Sisa Kasbon (Setor Kasir):" : diff < 0 ? "Kekurangan (Klaim Reimburse):" : "Status Saldo:"}
                        </span>
                        <strong className={`text-sm ${diff === 0 ? "text-slate-800" : diff > 0 ? "text-emerald-700" : "text-rose-700"}`}>
                          {diff === 0 ? "Rp 0 (Pas / Sesuai Pagu)" : formatRupiah(Math.abs(diff))}
                        </strong>
                        {diff > 0 && request.realization?.refundReceiptNumber && (
                          <span className="text-[10px] text-emerald-800 font-mono block mt-0.5">
                            BKM Kasir: {request.realization.refundReceiptNumber}
                          </span>
                        )}
                        {diff < 0 && request.realization?.reimbursementRequestNumber && (
                          <span className="text-[10px] text-rose-800 font-mono block mt-0.5">
                            Doc Reimburse: {request.realization.reimbursementRequestNumber}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })()}

                {/* Catatan Verifikasi & Penyelesaian Saldo */}
                {(request.realization?.auditNotes || request.realization?.financeNotes) && (
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs mb-4">
                    <strong className="block text-slate-800 mb-1">Catatan Verifikasi &amp; Rekonsiliasi Kas:</strong>
                    {request.realization.auditNotes && (
                      <p className="text-slate-600 mb-1"><span className="font-semibold text-slate-700">Audit Internal:</span> {request.realization.auditNotes}</p>
                    )}
                    {request.realization.financeNotes && (
                      <p className="text-slate-600"><span className="font-semibold text-emerald-700">Finance &amp; Kasir:</span> {request.realization.financeNotes}</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* DOKUMEN 4: FORMULIR PENERIMAAN BARANG FISIK (GOODS RECEIPT / BAST) */}
            {docType === "GOODS_RECEIPT" && request && (
              <div>
                <div className="text-center mb-6">
                  <h2 className="text-base font-extrabold uppercase underline tracking-wider text-slate-900">
                    Berita Acara Penerimaan Barang Fisik (Goods Receipt / BAST)
                  </h2>
                  <span className="text-xs text-slate-500 font-mono">
                    No. BAST: {request.goodsReceipt?.receiptNumber || `BAST-2026-${request.requestNumber.slice(-3)}`} &bull; Ref PO: {request.requestNumber}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs mb-6 border border-slate-200 rounded-lg p-3 bg-slate-50">
                  <div className="space-y-1">
                    <div><span className="text-slate-500">Pemasok / Vendor:</span> <strong>{request.goodsReceipt?.vendorName || request.vendorInfo?.vendorName || "PT. Schneider Electric Indonesia"}</strong></div>
                    <div><span className="text-slate-500">No. Surat Jalan Pengirim:</span> <strong className="font-mono">{request.goodsReceipt?.vendorDeliveryNoteNumber || "SJ-SCH-2026-9921"}</strong></div>
                    <div><span className="text-slate-500">Lokasi Pengecekan Fisik:</span> <strong>{request.goodsReceipt?.inspectionLocation || "Gudang Utama Sentul City"}</strong></div>
                  </div>
                  <div className="space-y-1">
                    <div><span className="text-slate-500">Tanggal Pemeriksaan:</span> <strong>{request.goodsReceipt?.receivedDate || "18/11/2026"}</strong></div>
                    <div><span className="text-slate-500">Pemeriksa (Tim Audit):</span> <strong>{request.goodsReceipt?.auditedBy || "Budi Santoso (Internal Audit)"}</strong></div>
                    <div><span className="text-slate-500">Staf Gudang / Logistik:</span> <strong>{request.goodsReceipt?.warehouseStaff || "Asep Sudrajat"}</strong></div>
                  </div>
                </div>

                {/* Tabel Pengecekan Fisik */}
                <div className="mb-6">
                  <h3 className="text-xs font-bold text-slate-900 uppercase mb-2">Hasil Pemeriksaan Fisik Barang oleh Tim Audit</h3>
                  <table className="w-full text-xs border border-slate-300 border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 border-b border-slate-300">
                        <th className="border border-slate-300 px-2 py-1.5 text-center w-10">No</th>
                        <th className="border border-slate-300 px-2 py-1.5 text-left">Nama Barang / Material Proyek</th>
                        <th className="border border-slate-300 px-2 py-1.5 text-center w-20">Qty Dipesan</th>
                        <th className="border border-slate-300 px-2 py-1.5 text-center w-20">Qty Fisik Tiba</th>
                        <th className="border border-slate-300 px-2 py-1.5 text-center w-20">Satuan</th>
                        <th className="border border-slate-300 px-2 py-1.5 text-center w-24">Kondisi Fisik</th>
                        <th className="border border-slate-300 px-2 py-1.5 text-left">Catatan Verifikasi Audit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(request.goodsReceipt?.items && request.goodsReceipt.items.length > 0 
                        ? request.goodsReceipt.items 
                        : [
                            { itemId: "g-1", itemCode: "KBL-NYY-16", itemName: "Kabel NYY 4x16mm Supreme", qtyOrdered: 2, qtyReceived: 2, unit: "Roll", condition: "GOOD", physicalAuditNotes: "Kondisi utuh segel pabrik, 100m/roll sesuai spesifikasi ME" },
                            { itemId: "g-2", itemCode: "MCB-3P-63A", itemName: "MCB 3 Phase 63A Schneider", qtyOrdered: 5, qtyReceived: 5, unit: "Pcs", condition: "GOOD", physicalAuditNotes: "Fisik mulus, barcode & kartu garansi lengkap" }
                          ]
                      ).map((item, idx) => (
                        <tr key={item.itemId} className="border-b border-slate-200">
                          <td className="border border-slate-300 px-2 py-1.5 text-center">{idx + 1}</td>
                          <td className="border border-slate-300 px-2 py-1.5">
                            <strong>{item.itemName}</strong>
                            <span className="block text-[10px] text-slate-500 font-mono">Kode: {item.itemCode}</span>
                          </td>
                          <td className="border border-slate-300 px-2 py-1.5 text-center">{item.qtyOrdered}</td>
                          <td className="border border-slate-300 px-2 py-1.5 text-center font-bold text-blue-700">{item.qtyReceived}</td>
                          <td className="border border-slate-300 px-2 py-1.5 text-center">{item.unit}</td>
                          <td className="border border-slate-300 px-2 py-1.5 text-center">
                            <span className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">
                              {item.condition === "GOOD" ? "BAIK / LENGKAP" : item.condition}
                            </span>
                          </td>
                          <td className="border border-slate-300 px-2 py-1.5 text-[11px] text-slate-700">{item.physicalAuditNotes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Lampiran Dokumen jika ada */}
                {request?.attachments && request.attachments.length > 0 && (
                  <div className="mb-6 p-3 bg-slate-50 border border-slate-300 rounded text-xs">
                    <span className="font-bold text-slate-800 block mb-2">
                      Lampiran Dokumen &amp; Foto Fisik ({request.attachments.length} Berkas):
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {request.attachments.map((att) => (
                        <div key={att.id} className="flex items-center gap-1.5 px-2 py-1 bg-white border border-slate-300 rounded text-[10px]">
                          {att.type.startsWith("image/") ? (
                            <img src={att.dataUrl} alt={att.name} className="w-5 h-5 object-cover rounded" />
                          ) : (
                            <FileText className="w-4 h-4 text-red-500" />
                          )}
                          <span className="font-medium text-slate-800 truncate max-w-[220px]">{att.name}</span>
                          <span className="text-slate-400 font-mono">({(att.size / 1024).toFixed(0)}KB)</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs mb-6 flex items-start gap-2 text-emerald-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Pernyataan Tim Audit Fisik:</strong> Barang pesanan telah diperiksa secara langsung di lokasi penerimaan, jumlah fisik sesuai dengan surat jalan pemasok, dan memenuhi spesifikasi teknis untuk implementasi proyek PT. Jayahana Manaura Mekanika Selaras.
                  </div>
                </div>
              </div>
            )}

            {/* DOKUMEN 5: FORMULIR FAKTUR PENJUALAN RESMI (SALES INVOICE) */}
            {docType === "SALES_INVOICE" && invoice && (
              <div>
                <div className="text-center mb-6">
                  <h2 className="text-base font-extrabold uppercase underline tracking-wider text-slate-900">
                    Faktur Penjualan / Tagihan Resmi (Sales Invoice)
                  </h2>
                  <span className="text-xs text-slate-500 font-mono">
                    Nomor Invoice: {invoice.invoiceNumber} &bull; No. Kontrak/SPK: {invoice.contractNumber}
                  </span>
                </div>

                {/* Box Data Klien & Tanggal */}
                <div className="grid grid-cols-2 gap-4 text-xs mb-6 border border-slate-300 rounded-lg p-3 bg-slate-50">
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Tagihan Ditujukan Kepada:</span>
                    <strong className="text-sm text-slate-900 block">{invoice.clientName}</strong>
                    <span className="text-slate-600 block">{invoice.clientAddress}</span>
                    {invoice.clientNPWP && (
                      <span className="text-slate-500 font-mono block text-[11px]">NPWP: {invoice.clientNPWP}</span>
                    )}
                    {invoice.clientPhone && (
                      <span className="text-slate-500 font-mono block text-[11px]">Kontak: {invoice.clientPhone}</span>
                    )}
                  </div>
                  <div className="space-y-1 text-right">
                    <div><span className="text-slate-500">Tanggal Faktur:</span> <strong>{invoice.invoiceDate}</strong></div>
                    <div><span className="text-slate-500">Jatuh Tempo:</span> <strong className="text-rose-700">{invoice.dueDate}</strong></div>
                    <div><span className="text-slate-500">Unit Bisnis:</span> <strong>{unitName}</strong></div>
                    <div><span className="text-slate-500">Status Pembayaran:</span> <strong className="text-blue-700">{invoice.status}</strong></div>
                  </div>
                </div>

                {/* Tabel Rincian Tagihan Pajak DPP, PPN, PPh 23 */}
                <div className="mb-6">
                  <table className="w-full text-xs border border-slate-300 border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 border-b border-slate-300">
                        <th className="border border-slate-300 px-3 py-2 text-center w-12">No</th>
                        <th className="border border-slate-300 px-3 py-2 text-left">Deskripsi Layanan / Progres Termin</th>
                        <th className="border border-slate-300 px-3 py-2 text-center w-28">Progres Fisik</th>
                        <th className="border border-slate-300 px-3 py-2 text-right w-36">Dasar Pengenaan Pajak (DPP)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-slate-200">
                        <td className="border border-slate-300 px-3 py-2 text-center">1</td>
                        <td className="border border-slate-300 px-3 py-2">
                          <strong className="block text-slate-900">{invoice.title}</strong>
                          <span className="text-slate-600 text-[11px] block">{invoice.description}</span>
                        </td>
                        <td className="border border-slate-300 px-3 py-2 text-center font-bold text-blue-700">
                          {invoice.progressPercent ? `${invoice.progressPercent}% Opname` : "100% Layanan"}
                        </td>
                        <td className="border border-slate-300 px-3 py-2 text-right font-semibold">
                          {formatRupiah(invoice.dppAmount)}
                        </td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr className="bg-slate-50">
                        <td colSpan={3} className="border border-slate-300 px-3 py-1.5 text-right font-medium">
                          Dasar Pengenaan Pajak (DPP):
                        </td>
                        <td className="border border-slate-300 px-3 py-1.5 text-right font-semibold font-mono">
                          {formatRupiah(invoice.dppAmount)}
                        </td>
                      </tr>
                      <tr className="bg-slate-50">
                        <td colSpan={3} className="border border-slate-300 px-3 py-1.5 text-right font-medium">
                          PPN 11% (Pajak Pertambahan Nilai):
                        </td>
                        <td className="border border-slate-300 px-3 py-1.5 text-right font-semibold text-emerald-700 font-mono">
                          +{formatRupiah(invoice.ppnAmount)}
                        </td>
                      </tr>
                      {invoice.pph23Amount ? (
                        <tr className="bg-slate-50">
                          <td colSpan={3} className="border border-slate-300 px-3 py-1.5 text-right font-medium">
                            PPh Pasal 23 ({invoice.pph23Percent}% Jasa Teknik):
                          </td>
                          <td className="border border-slate-300 px-3 py-1.5 text-right font-semibold text-slate-500 font-mono">
                            -{formatRupiah(invoice.pph23Amount)}
                          </td>
                        </tr>
                      ) : null}
                      <tr className="bg-blue-50 font-bold border-t-2 border-slate-400">
                        <td colSpan={3} className="border border-slate-300 px-3 py-2 text-right uppercase text-xs text-blue-900">
                          Total Tagihan Bersih (Net Payable):
                        </td>
                        <td className="border border-slate-300 px-3 py-2 text-right text-sm text-blue-900 font-mono font-extrabold">
                          {formatRupiah(invoice.totalAmount)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Lampiran Dokumen jika ada */}
                {request?.attachments && request.attachments.length > 0 && (
                  <div className="mb-6 p-3 bg-slate-50 border border-slate-300 rounded text-xs">
                    <span className="font-bold text-slate-800 block mb-2">
                      Lampiran Dokumen &amp; Foto ({request.attachments.length} Berkas):
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {request.attachments.map((att) => (
                        <div key={att.id} className="flex items-center gap-1.5 px-2 py-1 bg-white border border-slate-300 rounded text-[10px]">
                          {att.type.startsWith("image/") ? (
                            <img src={att.dataUrl} alt={att.name} className="w-5 h-5 object-cover rounded" />
                          ) : (
                            <FileText className="w-4 h-4 text-red-500" />
                          )}
                          <span className="font-medium text-slate-800 truncate max-w-[220px]">{att.name}</span>
                          <span className="text-slate-400 font-mono">({(att.size / 1024).toFixed(0)}KB)</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Instruksi Rekening Resmi Penampung */}
                <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-lg text-xs mb-6 space-y-1">
                  <span className="font-bold text-blue-950 uppercase tracking-wide block">Instruksi Pembayaran Resmi:</span>
                  <p className="text-slate-700">
                    Mohon pembayaran ditransfer langsung ke rekening resmi perusahaan berikut:
                  </p>
                  <div className="font-mono font-bold text-slate-900 text-[11px] bg-white p-2 rounded border border-blue-200 inline-block">
                    {invoice.targetBankAccount}
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">
                    *Harap mencantumkan Nomor Invoice ({invoice.invoiceNumber}) pada berita transfer dan mengirimkan bukti pembayaran ke finance@jayahana.co.id.
                  </p>
                </div>
              </div>
            )}

            {/* DOKUMEN 6: FORMULIR KUITANSI / BUKTI KAS MASUK RESMI (OFFICIAL RECEIPT / BKM) */}
            {docType === "OFFICIAL_RECEIPT" && (receipt || invoice) && (
              <div>
                {(() => {
                  const bkmNumber = receipt?.receiptNumber || invoice?.payments?.[0]?.voucherNumber || "BKM-2026-11-001";
                  const payer = receipt?.clientName || invoice?.clientName || "PT. Klien Terhormat";
                  const nominal = receipt?.amountReceived || invoice?.totalAmount || 0;
                  const purpose = receipt?.forPaymentOf || invoice?.title || "Pelunasan Tagihan Proyek";
                  const bankTarget = receipt?.bankTarget || invoice?.payments?.[0]?.bankAccount || "Bank BCA Operasional (A/C: 731-0982-11)";
                  const date = receipt?.receivedDate || invoice?.payments?.[0]?.paymentDate || "18/11/2026";

                  return (
                    <div>
                      <div className="text-center mb-6">
                        <h2 className="text-base font-extrabold uppercase underline tracking-wider text-slate-900">
                          Kuitansi Resmi / Bukti Kas Masuk (Official Receipt)
                        </h2>
                        <span className="text-xs text-slate-500 font-mono">
                          Nomor Kuitansi: {bkmNumber}
                        </span>
                      </div>

                      <div className="border border-slate-300 rounded-xl p-5 bg-slate-50/60 mb-6 space-y-3 text-xs">
                        <div className="grid grid-cols-4 gap-2 py-1.5 border-b border-slate-200">
                          <span className="text-slate-500 font-medium">Telah Diterima Dari</span>
                          <span className="col-span-3 font-bold text-slate-900 text-sm">: {payer}</span>
                        </div>
                        <div className="grid grid-cols-4 gap-2 py-1.5 border-b border-slate-200">
                          <span className="text-slate-500 font-medium">Sejumlah Uang</span>
                          <span className="col-span-3 font-bold text-emerald-800 text-sm font-mono">: {formatRupiah(nominal)}</span>
                        </div>
                        <div className="grid grid-cols-4 gap-2 py-1.5 border-b border-slate-200">
                          <span className="text-slate-500 font-medium">Untuk Pembayaran</span>
                          <span className="col-span-3 text-slate-800 font-medium">: {purpose}</span>
                        </div>
                        <div className="grid grid-cols-4 gap-2 py-1.5 border-b border-slate-200">
                          <span className="text-slate-500 font-medium">Rekening Penampung</span>
                          <span className="col-span-3 text-slate-700 font-mono">: {bankTarget}</span>
                        </div>
                        <div className="grid grid-cols-4 gap-2 py-1.5">
                          <span className="text-slate-500 font-medium">Tanggal Diterima</span>
                          <span className="col-span-3 text-slate-700 font-medium">: {date}</span>
                        </div>
                      </div>

                      <div className="p-4 bg-emerald-50 border-2 border-emerald-400 rounded-xl text-center mb-6">
                        <span className="text-xs text-emerald-800 uppercase font-bold tracking-wider block">Status Pelunasan:</span>
                        <div className="text-xl font-black text-emerald-950 mt-1">LUNAS / VERIFIED</div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* DOKUMEN 7: BERITA ACARA KEMAJUAN PEKERJAAN (BAKP / OPNAME FISIK) */}
            {docType === "PROGRESS_REPORT" && invoice && (
              <div>
                <div className="text-center mb-6">
                  <h2 className="text-base font-extrabold uppercase underline tracking-wider text-slate-900">
                    Berita Acara Kemajuan Pekerjaan (BAKP / Opname Fisik Proyek)
                  </h2>
                  <span className="text-xs text-slate-500 font-mono">
                    No. BAST-Progres: BAKP-ME-2026-004 &bull; Ref SPK: {invoice.contractNumber}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs mb-6 border border-slate-200 rounded-lg p-3 bg-slate-50">
                  <div className="space-y-1">
                    <div><span className="text-slate-500">Nama Klien / Pemberi Kerja:</span> <strong>{invoice.clientName}</strong></div>
                    <div><span className="text-slate-500">Nama Proyek:</span> <strong>{invoice.title}</strong></div>
                    <div><span className="text-slate-500">Lokasi Proyek:</span> <strong>{invoice.clientAddress}</strong></div>
                  </div>
                  <div className="space-y-1 text-right">
                    <div><span className="text-slate-500">Tanggal Opname:</span> <strong>{invoice.invoiceDate}</strong></div>
                    <div><span className="text-slate-500">Pencapaian Fisik:</span> <strong className="text-blue-700">{invoice.progressPercent || 35}% Selesai</strong></div>
                    <div><span className="text-slate-500">Nilai Tagihan DPP:</span> <strong>{formatRupiah(invoice.dppAmount)}</strong></div>
                  </div>
                </div>

                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs mb-6 text-slate-800 space-y-1.5">
                  <strong className="block text-blue-950 font-bold uppercase">Pernyataan Tim Audit & Pengawas Lapangan:</strong>
                  <p>
                    Berdasarkan hasil pemeriksaan fisik langsung di lokasi pekerjaan, instalasi panel listrik, penarikan kabel feeder, dan uji tahanan isolasi telah memenuhi spesifikasi teknis kontrak dan dinyatakan layak untuk dilakukan penagihan termin sebesar <strong>{invoice.progressPercent || 35}%</strong>.
                  </p>
                </div>
              </div>
            )}

            {/* TANDA TANGAN RESMI PERUSAHAAN SESUAI ALUR BERJENJANG */}
            <div className="mt-8 pt-4 border-t-2 border-slate-800">
              {request ? (
                /* Alur Approval Berjenjang untuk Pengajuan Anggaran & Kas Keluar */
                <div className={`grid ${docType === "DISBURSEMENT" || docType === "REALIZATION" ? "grid-cols-6" : "grid-cols-5"} gap-2 text-center text-xs`}>
                  {/* 1. Pemohon */}
                  <div className="flex flex-col justify-between h-32 border border-slate-200 p-1.5 rounded bg-slate-50/50">
                    <span className="text-[9px] uppercase font-bold text-slate-500">
                      1. Diajukan Oleh:
                    </span>
                    <div className="font-serif italic text-slate-400 text-[11px] my-auto">
                      [Tanda Tangan Digital]
                    </div>
                    <div>
                      <strong className="block text-slate-900 underline text-[11px]">
                        {request.requesterName}
                      </strong>
                      <span className="text-[9px] text-slate-500 block truncate">
                        {request.requesterRole} ({unitName})
                      </span>
                    </div>
                  </div>

                  {/* 2. Audit Internal */}
                  <div className="flex flex-col justify-between h-32 border border-slate-200 p-1.5 rounded bg-slate-50/50">
                    <span className="text-[9px] uppercase font-bold text-slate-500">
                      2. Diperiksa (Audit):
                    </span>
                    <div className="font-serif italic text-blue-700 text-[11px] my-auto">
                      [Verified by Audit]
                    </div>
                    <div>
                      <strong className="block text-slate-900 underline text-[11px]">Budi Santoso, S.Ak</strong>
                      <span className="text-[9px] text-slate-500 block">Internal Audit SOP &amp; Pagu</span>
                    </div>
                  </div>

                  {/* 3. Project Manager (PM) */}
                  <div className="flex flex-col justify-between h-32 border border-slate-200 p-1.5 rounded bg-slate-50/50">
                    <span className="text-[9px] uppercase font-bold text-slate-500">
                      3. Disetujui (PM):
                    </span>
                    <div className="font-serif italic text-sky-700 text-[11px] my-auto">
                      [Approved by PM]
                    </div>
                    <div>
                      <strong className="block text-slate-900 underline text-[11px]">Hendra Kurniawan, ST</strong>
                      <span className="text-[9px] text-slate-500 block">Project Manager</span>
                    </div>
                  </div>

                  {/* 4. General Manager (GM) */}
                  <div className="flex flex-col justify-between h-32 border border-slate-200 p-1.5 rounded bg-slate-50/50">
                    <span className="text-[9px] uppercase font-bold text-slate-500">
                      4. Diketahui (GM):
                    </span>
                    <div className="font-serif italic text-purple-700 text-[11px] my-auto">
                      [Approved by GM]
                    </div>
                    <div>
                      <strong className="block text-slate-900 underline text-[11px]">Bambang Wicaksono, SE</strong>
                      <span className="text-[9px] text-slate-500 block">General Manager</span>
                    </div>
                  </div>

                  {/* 5. Direktur Utama (Khusus Transaksi > Rp 5.000.000) */}
                  <div className="flex flex-col justify-between h-32 border border-slate-200 p-1.5 rounded bg-slate-50/50">
                    <span className="text-[9px] uppercase font-bold text-slate-500">
                      5. Otorisasi Dirut:
                    </span>
                    {((docType === "REALIZATION" ? (request.realization?.totalRealizedAmount || request.totalAmount) : request.totalAmount) > 5000000) ? (
                      <>
                        <div className="font-serif italic text-indigo-700 text-[11px] my-auto font-bold">
                          [Approved by Dirut]
                        </div>
                        <div>
                          <strong className="block text-slate-900 underline text-[11px]">Ir. H. Sidqi Johari, MT</strong>
                          <span className="text-[9px] text-slate-500 block">Direktur Utama (&gt; 5 Juta)</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="font-serif italic text-slate-400 text-[10px] my-auto px-1">
                          Tidak Diperlukan<br />(Nominal &le; Rp 5 Jt)
                        </div>
                        <div>
                          <span className="block text-slate-500 font-medium text-[10px]">Cukup Level GM</span>
                          <span className="text-[8px] text-slate-400 block">SOP Threshold &le; 5 Juta</span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* 6. Kasir / Finance (Khusus Form Pencairan BKK & Rekonsiliasi Kasbon LPJ) */}
                  {(docType === "DISBURSEMENT" || docType === "REALIZATION") && (
                    <div className="flex flex-col justify-between h-32 border border-emerald-300 p-1.5 rounded bg-emerald-50/50">
                      <span className="text-[9px] uppercase font-bold text-emerald-800">
                        {docType === "DISBURSEMENT" ? "6. Dibayarkan (Kasir):" : "6. Rekonsiliasi (Finance):"}
                      </span>
                      <div className="font-serif italic text-emerald-800 text-[10px] my-auto font-bold px-1">
                        {docType === "DISBURSEMENT" ? (
                          "[Paid & Attached]"
                        ) : request.realization?.balanceDifference === 0 ? (
                          "[Rekonsiliasi Selesai (Pas)]"
                        ) : (request.realization?.balanceDifference || 0) > 0 ? (
                          `[Setor Kasir: ${request.realization?.refundReceiptNumber || "BKM Lunas"}]`
                        ) : (
                          `[Klaim: ${request.realization?.reimbursementRequestNumber || "REIM-2026"}]`
                        )}
                      </div>
                      <div>
                        <strong className="block text-emerald-950 underline text-[11px]">Dewi Anggraeni, SE</strong>
                        <span className="text-[9px] text-emerald-700 block">Finance Head &amp; Kasir</span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* 4 Kolom Tanda Tangan untuk Faktur Penjualan / Tagihan Klien (AR) */
                <div className="grid grid-cols-4 gap-4 text-center text-xs">
                  {/* 1. Diajukan / Dibuat Oleh */}
                  <div className="flex flex-col justify-between h-32 border border-slate-200 p-2 rounded bg-slate-50/50">
                    <span className="text-[10px] uppercase font-bold text-slate-500">
                      Disiapkan Oleh (AR):
                    </span>
                    <div className="font-serif italic text-slate-400 text-xs my-auto">
                      [Tanda Tangan Digital]
                    </div>
                    <div>
                      <strong className="block text-slate-900 underline">
                        Siti Rahmawati
                      </strong>
                      <span className="text-[10px] text-slate-500 block">
                        Staf Billing &amp; AR
                      </span>
                    </div>
                  </div>

                  {/* 2. Diperiksa Oleh (Audit) */}
                  <div className="flex flex-col justify-between h-32 border border-slate-200 p-2 rounded bg-slate-50/50">
                    <span className="text-[10px] uppercase font-bold text-slate-500">
                      Audit Opname Fisik:
                    </span>
                    <div className="font-serif italic text-blue-700 text-xs my-auto">
                      [Verified by Audit]
                    </div>
                    <div>
                      <strong className="block text-slate-900 underline">Budi Santoso, S.Ak</strong>
                      <span className="text-[10px] text-slate-500 block">Tim Audit Internal</span>
                    </div>
                  </div>

                  {/* 3. Diverifikasi Oleh (Finance & Tax) */}
                  <div className="flex flex-col justify-between h-32 border border-slate-200 p-2 rounded bg-slate-50/50">
                    <span className="text-[10px] uppercase font-bold text-slate-500">
                      Verifikasi Tax &amp; Treasury:
                    </span>
                    <div className="font-serif italic text-emerald-700 text-xs my-auto">
                      [Verified by Finance]
                    </div>
                    <div>
                      <strong className="block text-slate-900 underline">Dewi Anggraeni, SE</strong>
                      <span className="text-[10px] text-slate-500 block">Finance &amp; Treasury Head</span>
                    </div>
                  </div>

                  {/* 4. Disetujui Oleh (Direktur) */}
                  <div className="flex flex-col justify-between h-32 border border-slate-200 p-2 rounded bg-slate-50/50">
                    <span className="text-[10px] uppercase font-bold text-slate-500">
                      Disahkan Oleh (Direksi):
                    </span>
                    <div className="font-serif italic text-slate-800 text-xs my-auto">
                      [Approved by Director]
                    </div>
                    <div>
                      <strong className="block text-slate-900 underline">Ir. H. Sidqi Johari, MT</strong>
                      <span className="text-[10px] text-slate-500 block">Direktur Utama</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Footer Keterangan Cetak */}
              <div className="mt-6 flex justify-between items-center text-[10px] text-slate-400 font-mono">
                <span>Dokumen ini dicetak otomatis dari Sistem ERP & Keuangan PT. Jayahana Manaura Mekanika Selaras</span>
                <span>Waktu Cetak: {new Date().toLocaleString("id-ID")}</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
