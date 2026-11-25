import { AccountCOA, FixedAsset, JournalRecord, WorksheetRow } from '@/types';

export const JAYAHANA_COA: AccountCOA[] = [
  {
    "code": "1-1111",
    "name": "KAS DAN SETARA KAS",
    "type": "ASSET",
    "category": "ASET_LANCAR",
    "normalBalance": "Debit",
    "isHeader": true,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "1-1000",
    "name": "Kas Ditangan",
    "type": "ASSET",
    "category": "ASET_LANCAR",
    "normalBalance": "Debit",
    "isHeader": true,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "1-1001",
    "name": "Petty Cash",
    "type": "ASSET",
    "category": "ASET_LANCAR",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "1-1002",
    "name": "Kontra Akun Kas & Bank",
    "type": "ASSET",
    "category": "ASET_LANCAR",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "1-1112",
    "name": "Kas Di Bank",
    "type": "ASSET",
    "category": "ASET_LANCAR",
    "normalBalance": "Debit",
    "isHeader": true,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "1-1003",
    "name": "Bank BCA-1 No.Rek : 5726088817",
    "type": "ASSET",
    "category": "ASET_LANCAR",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 1071023.0,
    "balance": 1071023.0
  },
  {
    "code": "1-1004",
    "name": "HiBank-2 No. Rek : 5302461653",
    "type": "ASSET",
    "category": "ASET_LANCAR",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "1-1005",
    "name": "Bank BCA-2 No.Rek : 5726387369",
    "type": "ASSET",
    "category": "ASET_LANCAR",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "1-1006",
    "name": "Bank Mandiri No.REK : 1330035418078",
    "type": "ASSET",
    "category": "ASET_LANCAR",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "1-9999",
    "name": "INSTRUMEN KEUANGAN",
    "type": "ASSET",
    "category": "ASET_LANCAR",
    "normalBalance": "Debit",
    "isHeader": true,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "1-9300",
    "name": "Investasi",
    "type": "ASSET",
    "category": "ASET_LANCAR",
    "normalBalance": "Debit",
    "isHeader": true,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "1-9301",
    "name": "Invetasi Jangka Pendek",
    "type": "ASSET",
    "category": "ASET_LANCAR",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "1-2222",
    "name": "PIUTANG",
    "type": "ASSET",
    "category": "ASET_LANCAR",
    "normalBalance": "Debit",
    "isHeader": true,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "1-2000",
    "name": "Piutang Usaha Pihak Ketiga",
    "type": "ASSET",
    "category": "ASET_LANCAR",
    "normalBalance": "Debit",
    "isHeader": true,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "1-2001",
    "name": "PT Integrasi Jaringan Ekosistem",
    "type": "ASSET",
    "category": "ASET_LANCAR",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "1-2002",
    "name": "PT Telemedia Komunikasi Pratama",
    "type": "ASSET",
    "category": "ASET_LANCAR",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "1-2003",
    "name": "PT Solusi Sinergi Digital",
    "type": "ASSET",
    "category": "ASET_LANCAR",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "1-2004",
    "name": "PT Turbo Daya Mekanika",
    "type": "ASSET",
    "category": "ASET_LANCAR",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "1-2005",
    "name": "PT GE Nusantara TU",
    "type": "ASSET",
    "category": "ASET_LANCAR",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "1-3001",
    "name": "PT Bina Pertiwi Energi",
    "type": "ASSET",
    "category": "ASET_LANCAR",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "1-3002",
    "name": "PT SPI Asianet",
    "type": "ASSET",
    "category": "ASET_LANCAR",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "1-3003",
    "name": "PT Sinar Kemala",
    "type": "ASSET",
    "category": "ASET_LANCAR",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "1-3004",
    "name": "PT 9",
    "type": "ASSET",
    "category": "ASET_LANCAR",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "1-3005",
    "name": "Cadangan Penurun Nilai Piutang",
    "type": "ASSET",
    "category": "ASET_LANCAR",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "1-4000",
    "name": "Piutang Usaha Pihak Berelasi",
    "type": "ASSET",
    "category": "ASET_LANCAR",
    "normalBalance": "Debit",
    "isHeader": true,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "1-4001",
    "name": "PT 6",
    "type": "ASSET",
    "category": "ASET_LANCAR",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "1-4002",
    "name": "PT 7",
    "type": "ASSET",
    "category": "ASET_LANCAR",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "1-4003",
    "name": "PT 8",
    "type": "ASSET",
    "category": "ASET_LANCAR",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "1-4004",
    "name": "PT 9",
    "type": "ASSET",
    "category": "ASET_LANCAR",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "1-4005",
    "name": "Cadangan Penurun Nilai Piutang",
    "type": "ASSET",
    "category": "ASET_LANCAR",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "1-5000",
    "name": "Piutang Usaha Lainnya",
    "type": "ASSET",
    "category": "ASET_LANCAR",
    "normalBalance": "Debit",
    "isHeader": true,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "1-5001",
    "name": "Advance Proyek Petty Cash",
    "type": "ASSET",
    "category": "ASET_LANCAR",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "1-5002",
    "name": "Advance Karyawan",
    "type": "ASSET",
    "category": "ASET_LANCAR",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "1-5003",
    "name": "Piutang Owner",
    "type": "ASSET",
    "category": "ASET_LANCAR",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "1-5004",
    "name": "Piutang Karyawan",
    "type": "ASSET",
    "category": "ASET_LANCAR",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "1-5005",
    "name": "Piutang Karyawan -1",
    "type": "ASSET",
    "category": "ASET_LANCAR",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "1-5006",
    "name": "Piutang Karyawan-2",
    "type": "ASSET",
    "category": "ASET_LANCAR",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "1-8100",
    "name": "PAJAK DIBAYAR DIMUKA",
    "type": "ASSET",
    "category": "ASET_LANCAR",
    "normalBalance": "Debit",
    "isHeader": true,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "1-8101",
    "name": "PPN Masukan",
    "type": "ASSET",
    "category": "ASET_LANCAR",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "1-8102",
    "name": "Pajak Dibayar Di Muka PPH 21",
    "type": "ASSET",
    "category": "ASET_LANCAR",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "1-8103",
    "name": "Pajak Dibayar Di Muka PPH 22 I",
    "type": "ASSET",
    "category": "ASET_LANCAR",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "1-8104",
    "name": "Pajak Dibayar Di Muka PPH 23",
    "type": "ASSET",
    "category": "ASET_LANCAR",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "1-8105",
    "name": "Pajak Dibayar Di Muka PPH 25",
    "type": "ASSET",
    "category": "ASET_LANCAR",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "1-8106",
    "name": "Pajak Tangguhan",
    "type": "ASSET",
    "category": "ASET_LANCAR",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "1-8107",
    "name": "PPN Prepaid",
    "type": "ASSET",
    "category": "ASET_LANCAR",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "1-8888",
    "name": "BIAYA DIBAYAR DIMUKA",
    "type": "ASSET",
    "category": "ASET_LANCAR",
    "normalBalance": "Debit",
    "isHeader": true,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "1-8000",
    "name": "Uang Muka",
    "type": "ASSET",
    "category": "ASET_LANCAR",
    "normalBalance": "Debit",
    "isHeader": true,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "1-8001",
    "name": "Uang Muka Pembelian",
    "type": "ASSET",
    "category": "ASET_LANCAR",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "1-8002",
    "name": "Uang Muka Lain-lain",
    "type": "ASSET",
    "category": "ASET_LANCAR",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "1-8003",
    "name": "Deposit",
    "type": "ASSET",
    "category": "ASET_LANCAR",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "1-7771",
    "name": "Sewa Dibayar Dimuka",
    "type": "ASSET",
    "category": "ASET_TETAP",
    "normalBalance": "Debit",
    "isHeader": true,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "1-7001",
    "name": "Sewa Dibayar Di Muka",
    "type": "ASSET",
    "category": "ASET_TETAP",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "1-7772",
    "name": "Biaya Dibayar Di muka",
    "type": "ASSET",
    "category": "ASET_TETAP",
    "normalBalance": "Debit",
    "isHeader": true,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "1-7002",
    "name": "Asuransi Dibayar Di Muka",
    "type": "ASSET",
    "category": "ASET_TETAP",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "1-6000",
    "name": "Persediaan",
    "type": "ASSET",
    "category": "ASET_TETAP",
    "normalBalance": "Debit",
    "isHeader": true,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "1-6001",
    "name": "Persediaan Peralatan Electronic",
    "type": "ASSET",
    "category": "ASET_TETAP",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "1-6002",
    "name": "Persediaan Bahan Pembantu",
    "type": "ASSET",
    "category": "ASET_TETAP",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "1-6003",
    "name": "Barang Dalam Proses (WIP)",
    "type": "ASSET",
    "category": "ASET_TETAP",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "1-6004",
    "name": "Persediaan Barang Jadi",
    "type": "ASSET",
    "category": "ASET_TETAP",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "1-6005",
    "name": "Penyisihan Penurunan Nilai Persediaan",
    "type": "ASSET",
    "category": "ASET_TETAP",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "1-9000",
    "name": "Aset Tetap",
    "type": "ASSET",
    "category": "ASET_LANCAR",
    "normalBalance": "Debit",
    "isHeader": true,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "1-9001",
    "name": "Mesin",
    "type": "ASSET",
    "category": "ASET_LANCAR",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "1-9002",
    "name": "Peralatan Eletronic",
    "type": "ASSET",
    "category": "ASET_LANCAR",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "1-9003",
    "name": "Furniture, Fixture & Equipment",
    "type": "ASSET",
    "category": "ASET_LANCAR",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "1-9004",
    "name": "Kendaraan Bermotor",
    "type": "ASSET",
    "category": "ASET_LANCAR",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "1-9005",
    "name": "Bangunan & Renovasi",
    "type": "ASSET",
    "category": "ASET_LANCAR",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "1-9100",
    "name": "Akumulasi Penyusutan Aset Tetap",
    "type": "ASSET",
    "category": "ASET_LANCAR",
    "normalBalance": "Kredit",
    "isHeader": true,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "1-9106",
    "name": "Akumulasi Penyusutan Mesin",
    "type": "ASSET",
    "category": "ASET_LANCAR",
    "normalBalance": "Kredit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "1-9107",
    "name": "Akumulasi Penyusutan Peralatan Electronic",
    "type": "ASSET",
    "category": "ASET_LANCAR",
    "normalBalance": "Kredit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "1-9108",
    "name": "Akumulasi Penyusutan Furniture, Fixture & Equipment",
    "type": "ASSET",
    "category": "ASET_LANCAR",
    "normalBalance": "Kredit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "1-9109",
    "name": "Akumulasi Penyusutan Kendaraan",
    "type": "ASSET",
    "category": "ASET_LANCAR",
    "normalBalance": "Kredit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "1-9110",
    "name": "Akumulasi Penyusutan Bangunan",
    "type": "ASSET",
    "category": "ASET_LANCAR",
    "normalBalance": "Kredit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "1-9201",
    "name": "Aset Dalam Proses",
    "type": "ASSET",
    "category": "ASET_LANCAR",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "1-9302",
    "name": "Investasi Jangka Panjang",
    "type": "ASSET",
    "category": "ASET_LANCAR",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "1-9401",
    "name": "Aset Tidak Lancar lainnya",
    "type": "ASSET",
    "category": "ASET_LANCAR",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "2-1000",
    "name": "Utang Usaha",
    "type": "LIABILITY",
    "category": "KEWAJIBAN_PENDEK",
    "normalBalance": "Kredit",
    "isHeader": true,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "2-1001",
    "name": "PT Global",
    "type": "LIABILITY",
    "category": "KEWAJIBAN_PENDEK",
    "normalBalance": "Kredit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "2-1002",
    "name": "CV Untera",
    "type": "LIABILITY",
    "category": "KEWAJIBAN_PENDEK",
    "normalBalance": "Kredit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "2-1003",
    "name": "PT Freedo",
    "type": "LIABILITY",
    "category": "KEWAJIBAN_PENDEK",
    "normalBalance": "Kredit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "2-1004",
    "name": "PT Andi Wijaya",
    "type": "LIABILITY",
    "category": "KEWAJIBAN_PENDEK",
    "normalBalance": "Kredit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "2-1005",
    "name": "PT 5",
    "type": "LIABILITY",
    "category": "KEWAJIBAN_PENDEK",
    "normalBalance": "Kredit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "2-1100",
    "name": "Utang Usaha Pihak Berelasi",
    "type": "LIABILITY",
    "category": "KEWAJIBAN_PENDEK",
    "normalBalance": "Debit",
    "isHeader": true,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "2-1101",
    "name": "PT JBD Pijar Utama",
    "type": "LIABILITY",
    "category": "KEWAJIBAN_PENDEK",
    "normalBalance": "Kredit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "2-1102",
    "name": "PT Jayahana Mohaez Agri",
    "type": "LIABILITY",
    "category": "KEWAJIBAN_PENDEK",
    "normalBalance": "Kredit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "2-1103",
    "name": "PT Jayahana Nunanu Boga Sukses",
    "type": "LIABILITY",
    "category": "KEWAJIBAN_PENDEK",
    "normalBalance": "Kredit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "2-4000",
    "name": "UTANG PAJAK",
    "type": "LIABILITY",
    "category": "KEWAJIBAN_PENDEK",
    "normalBalance": "Kredit",
    "isHeader": true,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "2-4001",
    "name": "PPN Keluaran",
    "type": "LIABILITY",
    "category": "KEWAJIBAN_PENDEK",
    "normalBalance": "Kredit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "2-4002",
    "name": "Hutang Pajak PPH 21",
    "type": "LIABILITY",
    "category": "KEWAJIBAN_PENDEK",
    "normalBalance": "Kredit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "2-4003",
    "name": "Hutang Pajak PPH 22",
    "type": "LIABILITY",
    "category": "KEWAJIBAN_PENDEK",
    "normalBalance": "Kredit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "2-4004",
    "name": "Hutang Pajak PPH 23",
    "type": "LIABILITY",
    "category": "KEWAJIBAN_PENDEK",
    "normalBalance": "Kredit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "2-4005",
    "name": "Hutang Pajak PPH 25",
    "type": "LIABILITY",
    "category": "KEWAJIBAN_PENDEK",
    "normalBalance": "Kredit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "2-4006",
    "name": "Hutang Pajak PPH 29",
    "type": "LIABILITY",
    "category": "KEWAJIBAN_PENDEK",
    "normalBalance": "Kredit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "2-4007",
    "name": "Hutang Pajak PPH Psl 4 ayat 2",
    "type": "LIABILITY",
    "category": "KEWAJIBAN_PENDEK",
    "normalBalance": "Kredit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "2-4008",
    "name": "PPN Akrual",
    "type": "LIABILITY",
    "category": "KEWAJIBAN_PENDEK",
    "normalBalance": "Kredit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "2-4009",
    "name": "PPH 23 Akrual",
    "type": "LIABILITY",
    "category": "KEWAJIBAN_PENDEK",
    "normalBalance": "Kredit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "2-4010",
    "name": "Bea Masuk Akrual",
    "type": "LIABILITY",
    "category": "KEWAJIBAN_PENDEK",
    "normalBalance": "Kredit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "2-4011",
    "name": "Utang Pajak -",
    "type": "LIABILITY",
    "category": "KEWAJIBAN_PENDEK",
    "normalBalance": "Kredit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "2-4012",
    "name": "Utang Pajak Lainnya",
    "type": "LIABILITY",
    "category": "KEWAJIBAN_PENDEK",
    "normalBalance": "Kredit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "2-2000",
    "name": "UTANG LAINNYA",
    "type": "LIABILITY",
    "category": "KEWAJIBAN_PENDEK",
    "normalBalance": "Kredit",
    "isHeader": true,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "2-2001",
    "name": "Ricky Indrawan",
    "type": "LIABILITY",
    "category": "KEWAJIBAN_PENDEK",
    "normalBalance": "Kredit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "2-2002",
    "name": "Shodiq Wicaksono",
    "type": "LIABILITY",
    "category": "KEWAJIBAN_PENDEK",
    "normalBalance": "Kredit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "2-2003",
    "name": "Pinjaman Dana",
    "type": "LIABILITY",
    "category": "KEWAJIBAN_PENDEK",
    "normalBalance": "Kredit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "2-2004",
    "name": "Pinjaman Online",
    "type": "LIABILITY",
    "category": "KEWAJIBAN_PENDEK",
    "normalBalance": "Kredit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "2-2005",
    "name": "Hutang Kendaraan",
    "type": "LIABILITY",
    "category": "KEWAJIBAN_PENDEK",
    "normalBalance": "Kredit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "2-2006",
    "name": "Budi Santosa",
    "type": "LIABILITY",
    "category": "KEWAJIBAN_PENDEK",
    "normalBalance": "Kredit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "2-2007",
    "name": "PT MPM (MAYA)",
    "type": "LIABILITY",
    "category": "KEWAJIBAN_PENDEK",
    "normalBalance": "Kredit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "2-3000",
    "name": "BIAYA MASIH HARUS DIBAYAR",
    "type": "LIABILITY",
    "category": "KEWAJIBAN_PANJANG",
    "normalBalance": "Debit",
    "isHeader": true,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "2-3001",
    "name": "Hutang Gaji",
    "type": "LIABILITY",
    "category": "KEWAJIBAN_PANJANG",
    "normalBalance": "Kredit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "2-3002",
    "name": "Hutang Ke Owner",
    "type": "LIABILITY",
    "category": "KEWAJIBAN_PANJANG",
    "normalBalance": "Kredit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "2-3003",
    "name": "Hutang Ke Karyawan",
    "type": "LIABILITY",
    "category": "KEWAJIBAN_PANJANG",
    "normalBalance": "Kredit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "2-3004",
    "name": "Hutang bunga",
    "type": "LIABILITY",
    "category": "KEWAJIBAN_PANJANG",
    "normalBalance": "Kredit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "2-5000",
    "name": "PENDAPATAN DITERIMA DIMUKA",
    "type": "LIABILITY",
    "category": "KEWAJIBAN_PANJANG",
    "normalBalance": "Debit",
    "isHeader": true,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "2-5001",
    "name": "Pendapatan Diterima Dimuka PT IJE",
    "type": "LIABILITY",
    "category": "KEWAJIBAN_PANJANG",
    "normalBalance": "Kredit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "2-5002",
    "name": "Credit Note",
    "type": "LIABILITY",
    "category": "KEWAJIBAN_PANJANG",
    "normalBalance": "Kredit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "2-6000",
    "name": "UANG MUKA PENJUALAN",
    "type": "LIABILITY",
    "category": "KEWAJIBAN_PANJANG",
    "normalBalance": "Debit",
    "isHeader": true,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "2-6001",
    "name": "Uang Muka Penjualan (Down Payment)",
    "type": "LIABILITY",
    "category": "KEWAJIBAN_PANJANG",
    "normalBalance": "Kredit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "2-6002",
    "name": "Credit Note",
    "type": "LIABILITY",
    "category": "KEWAJIBAN_PANJANG",
    "normalBalance": "Kredit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "2-7000",
    "name": "UTANG JANGKA PENDEK LAIN",
    "type": "LIABILITY",
    "category": "KEWAJIBAN_PANJANG",
    "normalBalance": "Kredit",
    "isHeader": true,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "2-7001",
    "name": "Hutang Bank",
    "type": "LIABILITY",
    "category": "KEWAJIBAN_PANJANG",
    "normalBalance": "Kredit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "2-7002",
    "name": "Deposit Investor",
    "type": "LIABILITY",
    "category": "KEWAJIBAN_PANJANG",
    "normalBalance": "Kredit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "2-8000",
    "name": "UTANG JANGKA PANJANG",
    "type": "LIABILITY",
    "category": "KEWAJIBAN_PANJANG",
    "normalBalance": "Kredit",
    "isHeader": true,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "2-8001",
    "name": "Hutang Bank",
    "type": "LIABILITY",
    "category": "KEWAJIBAN_PANJANG",
    "normalBalance": "Kredit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "2-8002",
    "name": "Uang Pesangon",
    "type": "LIABILITY",
    "category": "KEWAJIBAN_PANJANG",
    "normalBalance": "Kredit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "2-9000",
    "name": "LIABILITAS JANGKA PANJANG LAINNYA",
    "type": "LIABILITY",
    "category": "KEWAJIBAN_PANJANG",
    "normalBalance": "Kredit",
    "isHeader": true,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "2-9001",
    "name": "Utang Jangka Panjang Lainnya",
    "type": "LIABILITY",
    "category": "KEWAJIBAN_PANJANG",
    "normalBalance": "Kredit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "3-2111",
    "name": "Modal Saham",
    "type": "EQUITY",
    "category": "EKUITAS",
    "normalBalance": "Kredit",
    "isHeader": true,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "3-2001",
    "name": "Modal Dasar",
    "type": "EQUITY",
    "category": "EKUITAS",
    "normalBalance": "Kredit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "3-2002",
    "name": "Modal Yang Ditempatkan",
    "type": "EQUITY",
    "category": "EKUITAS",
    "normalBalance": "Kredit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "3-2222",
    "name": "Laba Ditahan",
    "type": "EQUITY",
    "category": "EKUITAS",
    "normalBalance": "Kredit",
    "isHeader": true,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "3-2003",
    "name": "Laba/Rugi Ditahan",
    "type": "EQUITY",
    "category": "EKUITAS",
    "normalBalance": "Kredit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "3-2004",
    "name": "Laba/Rugi Tahun Berjalan",
    "type": "EQUITY",
    "category": "EKUITAS",
    "normalBalance": "Kredit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "3-3001",
    "name": "Dividen",
    "type": "EQUITY",
    "category": "EKUITAS",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "3-4001",
    "name": "Prive",
    "type": "EQUITY",
    "category": "EKUITAS",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "3-5001",
    "name": "Agio Saham",
    "type": "EQUITY",
    "category": "EKUITAS",
    "normalBalance": "Kredit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "3-6001",
    "name": "Historical Balancing",
    "type": "EQUITY",
    "category": "EKUITAS",
    "normalBalance": "Kredit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "4-2000",
    "name": "PENDAPATAN",
    "type": "REVENUE",
    "category": "PENDAPATAN",
    "normalBalance": "Kredit",
    "isHeader": true,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "4-2001",
    "name": "Penjualan Produk",
    "type": "REVENUE",
    "category": "PENDAPATAN",
    "normalBalance": "Kredit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "4-2002",
    "name": "Pendapatan Jasa",
    "type": "REVENUE",
    "category": "PENDAPATAN",
    "normalBalance": "Kredit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "4-1001",
    "name": "Retur Penjualan Barang Jadi",
    "type": "REVENUE",
    "category": "PENDAPATAN",
    "normalBalance": "Kredit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "4-2005",
    "name": "Penjualan Lain-lain",
    "type": "REVENUE",
    "category": "PENDAPATAN",
    "normalBalance": "Kredit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "4-2006",
    "name": "Pendapatan Sewa",
    "type": "REVENUE",
    "category": "PENDAPATAN",
    "normalBalance": "Kredit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "4-2007",
    "name": "Potongan Penjualan/Diskon",
    "type": "REVENUE",
    "category": "PENDAPATAN",
    "normalBalance": "Kredit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "5-0000",
    "name": "HARGA POKOK PENJUALAN",
    "type": "EXPENSE",
    "category": "HPP_PROYEK",
    "normalBalance": "Debit",
    "isHeader": true,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "5-1000",
    "name": "BIAYA LANGSUNG PROYEK",
    "type": "EXPENSE",
    "category": "HPP_PROYEK",
    "normalBalance": "Debit",
    "isHeader": true,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "5-1001",
    "name": "Upah Borongan FTTH",
    "type": "EXPENSE",
    "category": "HPP_PROYEK",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "5-1002",
    "name": "SUB Kont. Machinning",
    "type": "EXPENSE",
    "category": "HPP_PROYEK",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "5-1003",
    "name": "Upah Borongan FAT Asianet SPI",
    "type": "EXPENSE",
    "category": "HPP_PROYEK",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "5-1004",
    "name": "Upah Borongan FWA",
    "type": "EXPENSE",
    "category": "HPP_PROYEK",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "5-1005",
    "name": "Upah Borongan Wifi Station",
    "type": "EXPENSE",
    "category": "HPP_PROYEK",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "5-2000",
    "name": "BEBAN PEMBELIAN IMPORT",
    "type": "EXPENSE",
    "category": "HPP_PROYEK",
    "normalBalance": "Debit",
    "isHeader": true,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "5-2001",
    "name": "Beban Freight",
    "type": "EXPENSE",
    "category": "HPP_PROYEK",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "5-2002",
    "name": "Beban Insurance",
    "type": "EXPENSE",
    "category": "HPP_PROYEK",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "5-2003",
    "name": "Beban Bea Masuk",
    "type": "EXPENSE",
    "category": "HPP_PROYEK",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "5-3000",
    "name": "LABOUR COST PROYEK",
    "type": "EXPENSE",
    "category": "HPP_PROYEK",
    "normalBalance": "Debit",
    "isHeader": true,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "5-3001",
    "name": "Biaya Gaji Karyawan Proyek",
    "type": "EXPENSE",
    "category": "HPP_PROYEK",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "5-3002",
    "name": "Biaya Lembur Karyawan Proyek",
    "type": "EXPENSE",
    "category": "HPP_PROYEK",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "5-3003",
    "name": "Beban Kesejahteraan Karyawan Proyek",
    "type": "EXPENSE",
    "category": "HPP_PROYEK",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "5-3004",
    "name": "Beban BPJS Kesehatan Proyek",
    "type": "EXPENSE",
    "category": "HPP_PROYEK",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "5-3005",
    "name": "Beban BPJS Ketenagakerjaan Proyek",
    "type": "EXPENSE",
    "category": "HPP_PROYEK",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "5-3006",
    "name": "Biaya Upah Harian Proyek",
    "type": "EXPENSE",
    "category": "HPP_PROYEK",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "5-3007",
    "name": "Biaya Upah Langsung Proyek",
    "type": "EXPENSE",
    "category": "HPP_PROYEK",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "5-3008",
    "name": "Biaya Upah Tidak langsung Proyek",
    "type": "EXPENSE",
    "category": "HPP_PROYEK",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "5-4000",
    "name": "OVERHEAD PROYEK",
    "type": "EXPENSE",
    "category": "HPP_PROYEK",
    "normalBalance": "Debit",
    "isHeader": true,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "5-4001",
    "name": "Biaya Transport & Perja-Din",
    "type": "EXPENSE",
    "category": "HPP_PROYEK",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "5-4002",
    "name": "Biaya Ticket & Acoomodation",
    "type": "EXPENSE",
    "category": "HPP_PROYEK",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "5-4003",
    "name": "Biaya Meal & Perja-Din",
    "type": "EXPENSE",
    "category": "HPP_PROYEK",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "5-4004",
    "name": "Biaya Komunikasi & Internet",
    "type": "EXPENSE",
    "category": "HPP_PROYEK",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "5-4005",
    "name": "Biaya Sewa Kantor Proyek",
    "type": "EXPENSE",
    "category": "HPP_PROYEK",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "5-4006",
    "name": "Biaya Sewa Kendaraan",
    "type": "EXPENSE",
    "category": "HPP_PROYEK",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "5-4007",
    "name": "Biaya Sewa Alat",
    "type": "EXPENSE",
    "category": "HPP_PROYEK",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "5-4008",
    "name": "Biaya Sewa Gudang",
    "type": "EXPENSE",
    "category": "HPP_PROYEK",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "5-4009",
    "name": "Biaya Percetakan (Stiker Dll)",
    "type": "EXPENSE",
    "category": "HPP_PROYEK",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "5-4010",
    "name": "Biaya Spare Part, supplies & Equipment",
    "type": "EXPENSE",
    "category": "HPP_PROYEK",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "5-4011",
    "name": "Biaya Perbaikan dan Pemeliharaan",
    "type": "EXPENSE",
    "category": "HPP_PROYEK",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "5-4012",
    "name": "Biaya Pengiriman",
    "type": "EXPENSE",
    "category": "HPP_PROYEK",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "5-4013",
    "name": "Biaya Loading Dan Un Loading",
    "type": "EXPENSE",
    "category": "HPP_PROYEK",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "5-4014",
    "name": "Biaya Perizinan Proyek",
    "type": "EXPENSE",
    "category": "HPP_PROYEK",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "5-4015",
    "name": "Beban Kantor Proyek",
    "type": "EXPENSE",
    "category": "HPP_PROYEK",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "5-4016",
    "name": "Biaya Bahan Bakar",
    "type": "EXPENSE",
    "category": "HPP_PROYEK",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "5-4017",
    "name": "Biaya Meal & Entertainment Proyek",
    "type": "EXPENSE",
    "category": "HPP_PROYEK",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "5-5000",
    "name": "BEBAN PENYUSUTAN AKTIVA TETAP PROYEK",
    "type": "EXPENSE",
    "category": "HPP_PROYEK",
    "normalBalance": "Debit",
    "isHeader": true,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "5-5001",
    "name": "Biaya Penyusutan Mesin",
    "type": "EXPENSE",
    "category": "HPP_PROYEK",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "5-5002",
    "name": "Biaya Penyusutan Electronic",
    "type": "EXPENSE",
    "category": "HPP_PROYEK",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "5-5003",
    "name": "Biaya Penyusutan Furniture, Fixture & Equipment",
    "type": "EXPENSE",
    "category": "HPP_PROYEK",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "5-5004",
    "name": "Biaya Penyusutan Kendaraan Bermotor",
    "type": "EXPENSE",
    "category": "HPP_PROYEK",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "5-5005",
    "name": "Biaya Penyusutan Bangunan & Renovasi",
    "type": "EXPENSE",
    "category": "HPP_PROYEK",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "6-0000",
    "name": "BEBAN USAHA",
    "type": "EXPENSE",
    "category": "BEBAN_OPERASIONAL",
    "normalBalance": "Debit",
    "isHeader": true,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "6-1000",
    "name": "Beban Pemasaran Dan Penjualan Lain",
    "type": "EXPENSE",
    "category": "BEBAN_OPERASIONAL",
    "normalBalance": "Debit",
    "isHeader": true,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "6-1001",
    "name": "Biaya Gaji Marketing",
    "type": "EXPENSE",
    "category": "BEBAN_OPERASIONAL",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "6-1002",
    "name": "Biaya Lembur Karyawan Marketing",
    "type": "EXPENSE",
    "category": "BEBAN_OPERASIONAL",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "6-1003",
    "name": "Beban Kesejahteraan Marketing",
    "type": "EXPENSE",
    "category": "BEBAN_OPERASIONAL",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "6-1004",
    "name": "Beban BPJS Kesehatan Marketing",
    "type": "EXPENSE",
    "category": "BEBAN_OPERASIONAL",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "6-1005",
    "name": "Beban BPJS Ketenagakerjaan Marketing",
    "type": "EXPENSE",
    "category": "BEBAN_OPERASIONAL",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "6-1006",
    "name": "Beban Gaji Frelance Marketing",
    "type": "EXPENSE",
    "category": "BEBAN_OPERASIONAL",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "6-2001",
    "name": "Beban Transport & Perja-Din Marketing",
    "type": "EXPENSE",
    "category": "BEBAN_OPERASIONAL",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "6-2002",
    "name": "Biaya Ticket & Acoomodation Marketing",
    "type": "EXPENSE",
    "category": "BEBAN_OPERASIONAL",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "6-2003",
    "name": "Beban Meal & Entertainment Marketing",
    "type": "EXPENSE",
    "category": "BEBAN_OPERASIONAL",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "6-2004",
    "name": "Biaya Komunikasi Marketing",
    "type": "EXPENSE",
    "category": "BEBAN_OPERASIONAL",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "6-2005",
    "name": "Beban Promosi Marketing",
    "type": "EXPENSE",
    "category": "BEBAN_OPERASIONAL",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "6-2006",
    "name": "Beban Sewa Mobil Marketing",
    "type": "EXPENSE",
    "category": "BEBAN_OPERASIONAL",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "6-3000",
    "name": "Biaya Karyawan Office & Management",
    "type": "EXPENSE",
    "category": "BEBAN_OPERASIONAL",
    "normalBalance": "Debit",
    "isHeader": true,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "6-3001",
    "name": "Biaya Gaji Office",
    "type": "EXPENSE",
    "category": "BEBAN_OPERASIONAL",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "6-3002",
    "name": "Biaya Lembur Office",
    "type": "EXPENSE",
    "category": "BEBAN_OPERASIONAL",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "6-3003",
    "name": "Beban Kesejahteraan Office",
    "type": "EXPENSE",
    "category": "BEBAN_OPERASIONAL",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "6-3004",
    "name": "Beban BPJS Kesehatan Office",
    "type": "EXPENSE",
    "category": "BEBAN_OPERASIONAL",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "6-3005",
    "name": "Beban BPJS Ketenagakerjaan Office",
    "type": "EXPENSE",
    "category": "BEBAN_OPERASIONAL",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "6-3006",
    "name": "Biaya Upah Harian Office",
    "type": "EXPENSE",
    "category": "BEBAN_OPERASIONAL",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "6-4000",
    "name": "Overhead Office",
    "type": "EXPENSE",
    "category": "BEBAN_OPERASIONAL",
    "normalBalance": "Debit",
    "isHeader": true,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "6-4001",
    "name": "Beban Transport & Perja-Din Office",
    "type": "EXPENSE",
    "category": "BEBAN_OPERASIONAL",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "6-4002",
    "name": "Biaya Ticket & Acoomodation Office",
    "type": "EXPENSE",
    "category": "BEBAN_OPERASIONAL",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "6-4003",
    "name": "Biaya Meal & Perja-Din Office",
    "type": "EXPENSE",
    "category": "BEBAN_OPERASIONAL",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "6-4004",
    "name": "Beban Komunikasi & Internet",
    "type": "EXPENSE",
    "category": "BEBAN_OPERASIONAL",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "6-4005",
    "name": "Beban Sewa Gedung Office",
    "type": "EXPENSE",
    "category": "BEBAN_OPERASIONAL",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "6-4006",
    "name": "Beban Sewa Kendaraan",
    "type": "EXPENSE",
    "category": "BEBAN_OPERASIONAL",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "6-4007",
    "name": "Beban Sewa Peralatan",
    "type": "EXPENSE",
    "category": "BEBAN_OPERASIONAL",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "6-4008",
    "name": "Biaya Perbaikan dan Pemeliharan",
    "type": "EXPENSE",
    "category": "BEBAN_OPERASIONAL",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "6-4009",
    "name": "Biaya Perlengkapan Office",
    "type": "EXPENSE",
    "category": "BEBAN_OPERASIONAL",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "6-4010",
    "name": "Biaya Internet Office",
    "type": "EXPENSE",
    "category": "BEBAN_OPERASIONAL",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "6-4011",
    "name": "Biaya Listrik Office",
    "type": "EXPENSE",
    "category": "BEBAN_OPERASIONAL",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "6-4012",
    "name": "Beban Air Office",
    "type": "EXPENSE",
    "category": "BEBAN_OPERASIONAL",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "6-4013",
    "name": "Beban Air Minum",
    "type": "EXPENSE",
    "category": "BEBAN_OPERASIONAL",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "6-4014",
    "name": "Beban PerIzinan",
    "type": "EXPENSE",
    "category": "BEBAN_OPERASIONAL",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "6-4015",
    "name": "Beban Kantor Office",
    "type": "EXPENSE",
    "category": "BEBAN_OPERASIONAL",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "6-4016",
    "name": "Beban ATK & Cetak",
    "type": "EXPENSE",
    "category": "BEBAN_OPERASIONAL",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "6-4017",
    "name": "Beban Keamanan & Kebersihan",
    "type": "EXPENSE",
    "category": "BEBAN_OPERASIONAL",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "6-4018",
    "name": "Beban Pelatihan & Pendidikan",
    "type": "EXPENSE",
    "category": "BEBAN_OPERASIONAL",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "6-4019",
    "name": "Beban Konsultan",
    "type": "EXPENSE",
    "category": "BEBAN_OPERASIONAL",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "6-4020",
    "name": "Low Value Asset",
    "type": "EXPENSE",
    "category": "BEBAN_OPERASIONAL",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "6-4021",
    "name": "Beban  Subscription",
    "type": "EXPENSE",
    "category": "BEBAN_OPERASIONAL",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "6-4022",
    "name": "Biaya Donation",
    "type": "EXPENSE",
    "category": "BEBAN_OPERASIONAL",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "6-5000",
    "name": "Beban Pajak",
    "type": "EXPENSE",
    "category": "BEBAN_OPERASIONAL",
    "normalBalance": "Debit",
    "isHeader": true,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "6-5001",
    "name": "Beban Pajak PPH 21",
    "type": "EXPENSE",
    "category": "BEBAN_OPERASIONAL",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "6-5002",
    "name": "Beban Pajak PPH 23",
    "type": "EXPENSE",
    "category": "BEBAN_OPERASIONAL",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "6-5003",
    "name": "Beban Pajak PPH 4 Ayat 2",
    "type": "EXPENSE",
    "category": "BEBAN_OPERASIONAL",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "6-5004",
    "name": "Beban Pajak PPH 22",
    "type": "EXPENSE",
    "category": "BEBAN_OPERASIONAL",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "6-5005",
    "name": "Beban Pajak PPN",
    "type": "EXPENSE",
    "category": "BEBAN_OPERASIONAL",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "6-5035",
    "name": "Beban Kantor dan Administrasi Lainnya",
    "type": "EXPENSE",
    "category": "BEBAN_OPERASIONAL",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "6-6000",
    "name": "Beban Penyusutan Aktiva Tetap Office",
    "type": "EXPENSE",
    "category": "BEBAN_OPERASIONAL",
    "normalBalance": "Debit",
    "isHeader": true,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "6-6001",
    "name": "Beban Penyusutan Mesin",
    "type": "EXPENSE",
    "category": "BEBAN_OPERASIONAL",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "6-6002",
    "name": "Beban Penyusutan Electronic",
    "type": "EXPENSE",
    "category": "BEBAN_OPERASIONAL",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "6-6003",
    "name": "Beban Penyusutan Furniture, Fixture & Equipment",
    "type": "EXPENSE",
    "category": "BEBAN_OPERASIONAL",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "6-6004",
    "name": "Beban Penyusutan Kendaraan Bermotor",
    "type": "EXPENSE",
    "category": "BEBAN_OPERASIONAL",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "6-6005",
    "name": "Beban Penyusutan Bangunan & Renovasi",
    "type": "EXPENSE",
    "category": "BEBAN_OPERASIONAL",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "9-2000",
    "name": "PENDAPATAN DILUAR USAHA",
    "type": "EXPENSE",
    "category": "BEBAN_LAIN",
    "normalBalance": "Kredit",
    "isHeader": true,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "9-2001",
    "name": "Pendapatan Bunga Bank",
    "type": "EXPENSE",
    "category": "BEBAN_LAIN",
    "normalBalance": "Kredit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "9-2002",
    "name": "Pendapatan Investasi",
    "type": "EXPENSE",
    "category": "BEBAN_LAIN",
    "normalBalance": "Kredit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "9-2003",
    "name": "Pendapatan Selisih Stock",
    "type": "EXPENSE",
    "category": "BEBAN_LAIN",
    "normalBalance": "Kredit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "9-2004",
    "name": "Laba Selisih Kurs",
    "type": "EXPENSE",
    "category": "BEBAN_LAIN",
    "normalBalance": "Kredit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "9-2005",
    "name": "Pendapatan Lain-Lain",
    "type": "EXPENSE",
    "category": "BEBAN_LAIN",
    "normalBalance": "Kredit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "9-2006",
    "name": "Taksiran PPh Final UKM",
    "type": "EXPENSE",
    "category": "BEBAN_LAIN",
    "normalBalance": "Kredit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "9-1001",
    "name": "Manfaat Deffered Tax",
    "type": "EXPENSE",
    "category": "BEBAN_LAIN",
    "normalBalance": "Kredit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "9-1002",
    "name": "Taksiran Beban Pajak Penghasilan Kini",
    "type": "EXPENSE",
    "category": "BEBAN_LAIN",
    "normalBalance": "Kredit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "8-2000",
    "name": "BIAYA DILUAR USAHA",
    "type": "EXPENSE",
    "category": "BEBAN_LAIN",
    "normalBalance": "Debit",
    "isHeader": true,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "8-2001",
    "name": "Beban Administrasi Bank",
    "type": "EXPENSE",
    "category": "BEBAN_LAIN",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "8-2002",
    "name": "Beban Pajak Pendapatan Bunga",
    "type": "EXPENSE",
    "category": "BEBAN_LAIN",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "8-2003",
    "name": "Beban Selisih Stock",
    "type": "EXPENSE",
    "category": "BEBAN_LAIN",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "8-2004",
    "name": "Beban Selisih Kurs",
    "type": "EXPENSE",
    "category": "BEBAN_LAIN",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "8-2005",
    "name": "Biaya Lain-Lain",
    "type": "EXPENSE",
    "category": "BEBAN_LAIN",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "8-2006",
    "name": "Not clear",
    "type": "EXPENSE",
    "category": "BEBAN_LAIN",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  },
  {
    "code": "8-1002",
    "name": "Beban Deffered Tax",
    "type": "EXPENSE",
    "category": "BEBAN_LAIN",
    "normalBalance": "Debit",
    "isHeader": false,
    "initialBalance": 0.0,
    "balance": 0.0
  }
];

export const JAYAHANA_FIXED_ASSETS: FixedAsset[] = [
  {
    "id": "ast-001",
    "assetCode": "AST-2026-001",
    "name": "Mobil Suzuki Grandmax",
    "acquisitionDate": "2025-11-17",
    "usefulLifeMonths": 60,
    "acquisitionCost": 88500000.0,
    "accumulatedDepreciation": 0.0,
    "monthlyDepreciation": 1475000.0,
    "bookValue": 88500000.0,
    "depreciationAccount": "6-4016 Beban Penyusutan Kendaraan",
    "accumulatedAccount": "1-7006 Akumulasi Penyusutan Kendaraan",
    "unitLocation": "Kantor Pusat / Proyek Sentul"
  },
  {
    "id": "ast-002",
    "assetCode": "AST-2026-002",
    "name": "Mobil Suzuki XL 7",
    "acquisitionDate": "2026-04-18",
    "usefulLifeMonths": 60,
    "acquisitionCost": 182500000.0,
    "accumulatedDepreciation": 0.0,
    "monthlyDepreciation": 3041667.0,
    "bookValue": 182500000.0,
    "depreciationAccount": "6-4016 Beban Penyusutan Kendaraan",
    "accumulatedAccount": "1-7006 Akumulasi Penyusutan Kendaraan",
    "unitLocation": "Kantor Pusat / Proyek Sentul"
  },
  {
    "id": "ast-003",
    "assetCode": "AST-2026-003",
    "name": "NOTEBOOK LENOVO THINKPAD",
    "acquisitionDate": "2026-10-15",
    "usefulLifeMonths": 48,
    "acquisitionCost": 3250000.0,
    "accumulatedDepreciation": 0.0,
    "monthlyDepreciation": 67708.0,
    "bookValue": 3250000.0,
    "depreciationAccount": "6-4015 Beban Penyusutan Peralatan & Aset",
    "accumulatedAccount": "1-7005 Akumulasi Penyusutan Peralatan",
    "unitLocation": "Kantor Pusat / Proyek Sentul"
  },
  {
    "id": "ast-004",
    "assetCode": "AST-2026-004",
    "name": "NOTEBOOK LENOVO THINKPAD",
    "acquisitionDate": "2026-10-15",
    "usefulLifeMonths": 48,
    "acquisitionCost": 3250000.0,
    "accumulatedDepreciation": 0.0,
    "monthlyDepreciation": 67708.0,
    "bookValue": 3250000.0,
    "depreciationAccount": "6-4015 Beban Penyusutan Peralatan & Aset",
    "accumulatedAccount": "1-7005 Akumulasi Penyusutan Peralatan",
    "unitLocation": "Kantor Pusat / Proyek Sentul"
  },
  {
    "id": "ast-005",
    "assetCode": "AST-2026-005",
    "name": "CHARGER NOTEBOOK ACER A515 65W",
    "acquisitionDate": "2026-10-22",
    "usefulLifeMonths": 48,
    "acquisitionCost": 164666.0,
    "accumulatedDepreciation": 0.0,
    "monthlyDepreciation": 3431.0,
    "bookValue": 164666.0,
    "depreciationAccount": "6-4015 Beban Penyusutan Peralatan & Aset",
    "accumulatedAccount": "1-7005 Akumulasi Penyusutan Peralatan",
    "unitLocation": "Kantor Pusat / Proyek Sentul"
  },
  {
    "id": "ast-006",
    "assetCode": "AST-2026-006",
    "name": "CHARGER NOTEBOOK ACER A314 45W",
    "acquisitionDate": "2026-10-22",
    "usefulLifeMonths": 48,
    "acquisitionCost": 164666.0,
    "accumulatedDepreciation": 0.0,
    "monthlyDepreciation": 3431.0,
    "bookValue": 164666.0,
    "depreciationAccount": "6-4015 Beban Penyusutan Peralatan & Aset",
    "accumulatedAccount": "1-7005 Akumulasi Penyusutan Peralatan",
    "unitLocation": "Kantor Pusat / Proyek Sentul"
  },
  {
    "id": "ast-007",
    "assetCode": "AST-2026-007",
    "name": "CHARGER NOTEBOOK LENOVO C14",
    "acquisitionDate": "2026-10-22",
    "usefulLifeMonths": 48,
    "acquisitionCost": 164666.0,
    "accumulatedDepreciation": 0.0,
    "monthlyDepreciation": 3431.0,
    "bookValue": 164666.0,
    "depreciationAccount": "6-4015 Beban Penyusutan Peralatan & Aset",
    "accumulatedAccount": "1-7005 Akumulasi Penyusutan Peralatan",
    "unitLocation": "Kantor Pusat / Proyek Sentul"
  },
  {
    "id": "ast-008",
    "assetCode": "AST-2026-008",
    "name": "MEJA KANTOR 100 x 350",
    "acquisitionDate": "2026-11-05",
    "usefulLifeMonths": 96,
    "acquisitionCost": 1500000.0,
    "accumulatedDepreciation": 0.0,
    "monthlyDepreciation": 15625.0,
    "bookValue": 1500000.0,
    "depreciationAccount": "6-4015 Beban Penyusutan Peralatan & Aset",
    "accumulatedAccount": "1-7005 Akumulasi Penyusutan Peralatan",
    "unitLocation": "Kantor Pusat / Proyek Sentul"
  },
  {
    "id": "ast-009",
    "assetCode": "AST-2026-009",
    "name": "MEJA KANTOR UK L",
    "acquisitionDate": "2026-11-05",
    "usefulLifeMonths": 96,
    "acquisitionCost": 1800000.0,
    "accumulatedDepreciation": 0.0,
    "monthlyDepreciation": 18750.0,
    "bookValue": 1800000.0,
    "depreciationAccount": "6-4015 Beban Penyusutan Peralatan & Aset",
    "accumulatedAccount": "1-7005 Akumulasi Penyusutan Peralatan",
    "unitLocation": "Kantor Pusat / Proyek Sentul"
  },
  {
    "id": "ast-010",
    "assetCode": "AST-2026-010",
    "name": "KURSI KERJA NON RODA",
    "acquisitionDate": "2026-11-05",
    "usefulLifeMonths": 96,
    "acquisitionCost": 300000.0,
    "accumulatedDepreciation": 0.0,
    "monthlyDepreciation": 3125.0,
    "bookValue": 300000.0,
    "depreciationAccount": "6-4015 Beban Penyusutan Peralatan & Aset",
    "accumulatedAccount": "1-7005 Akumulasi Penyusutan Peralatan",
    "unitLocation": "Kantor Pusat / Proyek Sentul"
  },
  {
    "id": "ast-011",
    "assetCode": "AST-2026-011",
    "name": "KURSI KERJA NON RODA",
    "acquisitionDate": "2026-11-05",
    "usefulLifeMonths": 96,
    "acquisitionCost": 300000.0,
    "accumulatedDepreciation": 0.0,
    "monthlyDepreciation": 3125.0,
    "bookValue": 300000.0,
    "depreciationAccount": "6-4015 Beban Penyusutan Peralatan & Aset",
    "accumulatedAccount": "1-7005 Akumulasi Penyusutan Peralatan",
    "unitLocation": "Kantor Pusat / Proyek Sentul"
  },
  {
    "id": "ast-012",
    "assetCode": "AST-2026-012",
    "name": "KURSI KERJA NON RODA",
    "acquisitionDate": "2026-11-05",
    "usefulLifeMonths": 96,
    "acquisitionCost": 300000.0,
    "accumulatedDepreciation": 0.0,
    "monthlyDepreciation": 3125.0,
    "bookValue": 300000.0,
    "depreciationAccount": "6-4015 Beban Penyusutan Peralatan & Aset",
    "accumulatedAccount": "1-7005 Akumulasi Penyusutan Peralatan",
    "unitLocation": "Kantor Pusat / Proyek Sentul"
  },
  {
    "id": "ast-013",
    "assetCode": "AST-2026-013",
    "name": "KURSI KERJA NON RODA",
    "acquisitionDate": "2026-11-05",
    "usefulLifeMonths": 96,
    "acquisitionCost": 300000.0,
    "accumulatedDepreciation": 0.0,
    "monthlyDepreciation": 3125.0,
    "bookValue": 300000.0,
    "depreciationAccount": "6-4015 Beban Penyusutan Peralatan & Aset",
    "accumulatedAccount": "1-7005 Akumulasi Penyusutan Peralatan",
    "unitLocation": "Kantor Pusat / Proyek Sentul"
  },
  {
    "id": "ast-014",
    "assetCode": "AST-2026-014",
    "name": "KURSI KERJA NON RODA",
    "acquisitionDate": "2026-11-05",
    "usefulLifeMonths": 96,
    "acquisitionCost": 300000.0,
    "accumulatedDepreciation": 0.0,
    "monthlyDepreciation": 3125.0,
    "bookValue": 300000.0,
    "depreciationAccount": "6-4015 Beban Penyusutan Peralatan & Aset",
    "accumulatedAccount": "1-7005 Akumulasi Penyusutan Peralatan",
    "unitLocation": "Kantor Pusat / Proyek Sentul"
  },
  {
    "id": "ast-015",
    "assetCode": "AST-2026-015",
    "name": "KURSI KERJA NON RODA",
    "acquisitionDate": "2026-11-05",
    "usefulLifeMonths": 96,
    "acquisitionCost": 300000.0,
    "accumulatedDepreciation": 0.0,
    "monthlyDepreciation": 3125.0,
    "bookValue": 300000.0,
    "depreciationAccount": "6-4015 Beban Penyusutan Peralatan & Aset",
    "accumulatedAccount": "1-7005 Akumulasi Penyusutan Peralatan",
    "unitLocation": "Kantor Pusat / Proyek Sentul"
  },
  {
    "id": "ast-016",
    "assetCode": "AST-2026-016",
    "name": "KURSI KERJA NON RODA",
    "acquisitionDate": "2026-11-05",
    "usefulLifeMonths": 96,
    "acquisitionCost": 300000.0,
    "accumulatedDepreciation": 0.0,
    "monthlyDepreciation": 3125.0,
    "bookValue": 300000.0,
    "depreciationAccount": "6-4015 Beban Penyusutan Peralatan & Aset",
    "accumulatedAccount": "1-7005 Akumulasi Penyusutan Peralatan",
    "unitLocation": "Kantor Pusat / Proyek Sentul"
  },
  {
    "id": "ast-017",
    "assetCode": "AST-2026-017",
    "name": "KURSI KERJA NON RODA",
    "acquisitionDate": "2026-11-05",
    "usefulLifeMonths": 96,
    "acquisitionCost": 300000.0,
    "accumulatedDepreciation": 0.0,
    "monthlyDepreciation": 3125.0,
    "bookValue": 300000.0,
    "depreciationAccount": "6-4015 Beban Penyusutan Peralatan & Aset",
    "accumulatedAccount": "1-7005 Akumulasi Penyusutan Peralatan",
    "unitLocation": "Kantor Pusat / Proyek Sentul"
  },
  {
    "id": "ast-018",
    "assetCode": "AST-2026-018",
    "name": "KURSI KERJA NON RODA",
    "acquisitionDate": "2026-11-05",
    "usefulLifeMonths": 96,
    "acquisitionCost": 300000.0,
    "accumulatedDepreciation": 0.0,
    "monthlyDepreciation": 3125.0,
    "bookValue": 300000.0,
    "depreciationAccount": "6-4015 Beban Penyusutan Peralatan & Aset",
    "accumulatedAccount": "1-7005 Akumulasi Penyusutan Peralatan",
    "unitLocation": "Kantor Pusat / Proyek Sentul"
  },
  {
    "id": "ast-019",
    "assetCode": "AST-2026-019",
    "name": "KURSI KERJA NON RODA",
    "acquisitionDate": "2026-11-05",
    "usefulLifeMonths": 96,
    "acquisitionCost": 300000.0,
    "accumulatedDepreciation": 0.0,
    "monthlyDepreciation": 3125.0,
    "bookValue": 300000.0,
    "depreciationAccount": "6-4015 Beban Penyusutan Peralatan & Aset",
    "accumulatedAccount": "1-7005 Akumulasi Penyusutan Peralatan",
    "unitLocation": "Kantor Pusat / Proyek Sentul"
  },
  {
    "id": "ast-020",
    "assetCode": "AST-2026-020",
    "name": "KURSI HYDROLIC RODA",
    "acquisitionDate": "2026-11-05",
    "usefulLifeMonths": 96,
    "acquisitionCost": 233333.0,
    "accumulatedDepreciation": 0.0,
    "monthlyDepreciation": 2431.0,
    "bookValue": 233333.0,
    "depreciationAccount": "6-4015 Beban Penyusutan Peralatan & Aset",
    "accumulatedAccount": "1-7005 Akumulasi Penyusutan Peralatan",
    "unitLocation": "Kantor Pusat / Proyek Sentul"
  }
];

export const JAYAHANA_JOURNAL_ENTRIES: JournalRecord[] = [
  {
    "id": "jrn-001",
    "voucherNumber": "JV-2026-01-001",
    "date": "2026-01-01",
    "month": 1,
    "referenceNumber": "001-BO2601",
    "description": "Pencatatan Biaya Gaji Karyawan Proyek",
    "unit": "ME_CORE",
    "lines": [
      {
        "id": "jl-1",
        "accountCode": "5-3001",
        "accountName": "Biaya Gaji Karyawan Proyek",
        "debit": 500000.0,
        "credit": 0
      },
      {
        "id": "jl-2",
        "accountCode": "1-1003",
        "accountName": "Bank BCA-1 No.Rek : 5726088817",
        "debit": 0,
        "credit": 500000.0
      }
    ],
    "isAdjustment": false,
    "postedAt": "2026-01-01"
  },
  {
    "id": "jrn-002",
    "voucherNumber": "JV-2026-01-002",
    "date": "2026-01-02",
    "month": 1,
    "referenceNumber": "002-BO2601",
    "description": "Pencatatan Biaya Gaji Karyawan Proyek",
    "unit": "ME_CORE",
    "lines": [
      {
        "id": "jl-3",
        "accountCode": "5-3001",
        "accountName": "Biaya Gaji Karyawan Proyek",
        "debit": 100000.0,
        "credit": 0
      },
      {
        "id": "jl-4",
        "accountCode": "1-1003",
        "accountName": "Bank BCA-1 No.Rek : 5726088817",
        "debit": 0,
        "credit": 100000.0
      }
    ],
    "isAdjustment": false,
    "postedAt": "2026-01-02"
  },
  {
    "id": "jrn-003",
    "voucherNumber": "JV-2026-01-003",
    "date": "2026-01-02",
    "month": 1,
    "referenceNumber": "003-BI2601",
    "description": "Pencatatan Advance Proyek Petty Cash",
    "unit": "ME_CORE",
    "lines": [
      {
        "id": "jl-5",
        "accountCode": "1-5001",
        "accountName": "Advance Proyek Petty Cash",
        "debit": 10000000.0,
        "credit": 0
      },
      {
        "id": "jl-6",
        "accountCode": "1-1004",
        "accountName": "HiBank-2 No. Rek : 5302461653",
        "debit": 0,
        "credit": 10000000.0
      }
    ],
    "isAdjustment": false,
    "postedAt": "2026-01-02"
  },
  {
    "id": "jrn-004",
    "voucherNumber": "JV-2026-01-004",
    "date": "2026-01-02",
    "month": 1,
    "referenceNumber": "003-BI2601",
    "description": "Pencatatan Bank BCA-1 No.Rek : 5726088817",
    "unit": "OVERHEAD_OPERASIONAL",
    "lines": [
      {
        "id": "jl-7",
        "accountCode": "1-1003",
        "accountName": "Bank BCA-1 No.Rek : 5726088817",
        "debit": 59000000.0,
        "credit": 0
      },
      {
        "id": "jl-8",
        "accountCode": "1-1004",
        "accountName": "HiBank-2 No. Rek : 5302461653",
        "debit": 0,
        "credit": 59000000.0
      }
    ],
    "isAdjustment": false,
    "postedAt": "2026-01-02"
  },
  {
    "id": "jrn-005",
    "voucherNumber": "JV-2026-01-005",
    "date": "2026-01-02",
    "month": 1,
    "referenceNumber": "004-BO2601",
    "description": "Pencatatan Biaya Spare Part, supplies & Equipment",
    "unit": "OVERHEAD_OPERASIONAL",
    "lines": [
      {
        "id": "jl-9",
        "accountCode": "5-4010",
        "accountName": "Biaya Spare Part, supplies & Equipment",
        "debit": 100000.0,
        "credit": 0
      },
      {
        "id": "jl-10",
        "accountCode": "1-1003",
        "accountName": "Bank BCA-1 No.Rek : 5726088817",
        "debit": 0,
        "credit": 100000.0
      }
    ],
    "isAdjustment": false,
    "postedAt": "2026-01-02"
  },
  {
    "id": "jrn-006",
    "voucherNumber": "JV-2026-01-006",
    "date": "2026-01-05",
    "month": 1,
    "referenceNumber": "005-BO2601",
    "description": "Pencatatan Biaya Gaji Office",
    "unit": "OVERHEAD_OPERASIONAL",
    "lines": [
      {
        "id": "jl-11",
        "accountCode": "6-3001",
        "accountName": "Biaya Gaji Office",
        "debit": 1920000.0,
        "credit": 0
      },
      {
        "id": "jl-12",
        "accountCode": "1-1003",
        "accountName": "Bank BCA-1 No.Rek : 5726088817",
        "debit": 0,
        "credit": 1920000.0
      }
    ],
    "isAdjustment": false,
    "postedAt": "2026-01-05"
  },
  {
    "id": "jrn-007",
    "voucherNumber": "JV-2026-01-007",
    "date": "2026-01-05",
    "month": 1,
    "referenceNumber": "005-BO2601",
    "description": "Pencatatan Biaya Gaji Office",
    "unit": "OVERHEAD_OPERASIONAL",
    "lines": [
      {
        "id": "jl-13",
        "accountCode": "6-3001",
        "accountName": "Biaya Gaji Office",
        "debit": 940000.0,
        "credit": 0
      },
      {
        "id": "jl-14",
        "accountCode": "1-1003",
        "accountName": "Bank BCA-1 No.Rek : 5726088817",
        "debit": 0,
        "credit": 940000.0
      }
    ],
    "isAdjustment": false,
    "postedAt": "2026-01-05"
  },
  {
    "id": "jrn-008",
    "voucherNumber": "JV-2026-01-008",
    "date": "2026-01-05",
    "month": 1,
    "referenceNumber": "005-BO2601",
    "description": "Pencatatan Biaya Gaji Office",
    "unit": "OVERHEAD_OPERASIONAL",
    "lines": [
      {
        "id": "jl-15",
        "accountCode": "6-3001",
        "accountName": "Biaya Gaji Office",
        "debit": 1512000.0,
        "credit": 0
      },
      {
        "id": "jl-16",
        "accountCode": "1-1003",
        "accountName": "Bank BCA-1 No.Rek : 5726088817",
        "debit": 0,
        "credit": 1512000.0
      }
    ],
    "isAdjustment": false,
    "postedAt": "2026-01-05"
  },
  {
    "id": "jrn-009",
    "voucherNumber": "JV-2026-01-009",
    "date": "2026-01-05",
    "month": 1,
    "referenceNumber": "005-BO2601",
    "description": "Pencatatan Biaya Gaji Office",
    "unit": "OVERHEAD_OPERASIONAL",
    "lines": [
      {
        "id": "jl-17",
        "accountCode": "6-3001",
        "accountName": "Biaya Gaji Office",
        "debit": 1180000.0,
        "credit": 0
      },
      {
        "id": "jl-18",
        "accountCode": "1-1003",
        "accountName": "Bank BCA-1 No.Rek : 5726088817",
        "debit": 0,
        "credit": 1180000.0
      }
    ],
    "isAdjustment": false,
    "postedAt": "2026-01-05"
  },
  {
    "id": "jrn-010",
    "voucherNumber": "JV-2026-01-010",
    "date": "2026-01-05",
    "month": 1,
    "referenceNumber": "005-BO2601",
    "description": "Pencatatan Biaya Gaji Office",
    "unit": "OVERHEAD_OPERASIONAL",
    "lines": [
      {
        "id": "jl-19",
        "accountCode": "6-3001",
        "accountName": "Biaya Gaji Office",
        "debit": 640000.0,
        "credit": 0
      },
      {
        "id": "jl-20",
        "accountCode": "1-1003",
        "accountName": "Bank BCA-1 No.Rek : 5726088817",
        "debit": 0,
        "credit": 640000.0
      }
    ],
    "isAdjustment": false,
    "postedAt": "2026-01-05"
  },
  {
    "id": "jrn-011",
    "voucherNumber": "JV-2026-01-011",
    "date": "2026-01-05",
    "month": 1,
    "referenceNumber": "005-BO2601",
    "description": "Pencatatan Biaya Gaji Office",
    "unit": "OVERHEAD_OPERASIONAL",
    "lines": [
      {
        "id": "jl-21",
        "accountCode": "6-3001",
        "accountName": "Biaya Gaji Office",
        "debit": 356800.0,
        "credit": 0
      },
      {
        "id": "jl-22",
        "accountCode": "1-1003",
        "accountName": "Bank BCA-1 No.Rek : 5726088817",
        "debit": 0,
        "credit": 356800.0
      }
    ],
    "isAdjustment": false,
    "postedAt": "2026-01-05"
  },
  {
    "id": "jrn-012",
    "voucherNumber": "JV-2026-01-012",
    "date": "2026-01-05",
    "month": 1,
    "referenceNumber": "005-BO2601",
    "description": "Pencatatan Biaya Gaji Office",
    "unit": "OVERHEAD_OPERASIONAL",
    "lines": [
      {
        "id": "jl-23",
        "accountCode": "6-3001",
        "accountName": "Biaya Gaji Office",
        "debit": 403200.0,
        "credit": 0
      },
      {
        "id": "jl-24",
        "accountCode": "1-1003",
        "accountName": "Bank BCA-1 No.Rek : 5726088817",
        "debit": 0,
        "credit": 403200.0
      }
    ],
    "isAdjustment": false,
    "postedAt": "2026-01-05"
  },
  {
    "id": "jrn-013",
    "voucherNumber": "JV-2026-01-013",
    "date": "2026-01-05",
    "month": 1,
    "referenceNumber": "005-BO2601",
    "description": "Pencatatan Biaya Gaji Office",
    "unit": "OVERHEAD_OPERASIONAL",
    "lines": [
      {
        "id": "jl-25",
        "accountCode": "6-3001",
        "accountName": "Biaya Gaji Office",
        "debit": 1200000.0,
        "credit": 0
      },
      {
        "id": "jl-26",
        "accountCode": "1-1003",
        "accountName": "Bank BCA-1 No.Rek : 5726088817",
        "debit": 0,
        "credit": 1200000.0
      }
    ],
    "isAdjustment": false,
    "postedAt": "2026-01-05"
  },
  {
    "id": "jrn-014",
    "voucherNumber": "JV-2026-01-014",
    "date": "2026-01-05",
    "month": 1,
    "referenceNumber": "005-BO2601",
    "description": "Pencatatan Biaya Gaji Office",
    "unit": "OVERHEAD_OPERASIONAL",
    "lines": [
      {
        "id": "jl-27",
        "accountCode": "6-3001",
        "accountName": "Biaya Gaji Office",
        "debit": 900000.0,
        "credit": 0
      },
      {
        "id": "jl-28",
        "accountCode": "1-1003",
        "accountName": "Bank BCA-1 No.Rek : 5726088817",
        "debit": 0,
        "credit": 900000.0
      }
    ],
    "isAdjustment": false,
    "postedAt": "2026-01-05"
  },
  {
    "id": "jrn-015",
    "voucherNumber": "JV-2026-01-015",
    "date": "2026-01-05",
    "month": 1,
    "referenceNumber": "005-BO2601",
    "description": "Pencatatan Biaya Gaji Office",
    "unit": "OVERHEAD_OPERASIONAL",
    "lines": [
      {
        "id": "jl-29",
        "accountCode": "6-3001",
        "accountName": "Biaya Gaji Office",
        "debit": 3500000.0,
        "credit": 0
      },
      {
        "id": "jl-30",
        "accountCode": "1-1003",
        "accountName": "Bank BCA-1 No.Rek : 5726088817",
        "debit": 0,
        "credit": 3500000.0
      }
    ],
    "isAdjustment": false,
    "postedAt": "2026-01-05"
  },
  {
    "id": "jrn-016",
    "voucherNumber": "JV-2026-01-016",
    "date": "2026-01-05",
    "month": 1,
    "referenceNumber": "005-BO2601",
    "description": "Pencatatan Biaya Gaji Office",
    "unit": "OVERHEAD_OPERASIONAL",
    "lines": [
      {
        "id": "jl-31",
        "accountCode": "6-3001",
        "accountName": "Biaya Gaji Office",
        "debit": 2990000.0,
        "credit": 0
      },
      {
        "id": "jl-32",
        "accountCode": "1-1003",
        "accountName": "Bank BCA-1 No.Rek : 5726088817",
        "debit": 0,
        "credit": 2990000.0
      }
    ],
    "isAdjustment": false,
    "postedAt": "2026-01-05"
  },
  {
    "id": "jrn-017",
    "voucherNumber": "JV-2026-01-017",
    "date": "2026-01-05",
    "month": 1,
    "referenceNumber": "005-BO2601",
    "description": "Pencatatan Biaya Gaji Office",
    "unit": "OVERHEAD_OPERASIONAL",
    "lines": [
      {
        "id": "jl-33",
        "accountCode": "6-3001",
        "accountName": "Biaya Gaji Office",
        "debit": 2530000.0,
        "credit": 0
      },
      {
        "id": "jl-34",
        "accountCode": "1-1003",
        "accountName": "Bank BCA-1 No.Rek : 5726088817",
        "debit": 0,
        "credit": 2530000.0
      }
    ],
    "isAdjustment": false,
    "postedAt": "2026-01-05"
  },
  {
    "id": "jrn-018",
    "voucherNumber": "JV-2026-01-018",
    "date": "2026-01-05",
    "month": 1,
    "referenceNumber": "005-BO2601",
    "description": "Pencatatan Biaya Gaji Office",
    "unit": "OVERHEAD_OPERASIONAL",
    "lines": [
      {
        "id": "jl-35",
        "accountCode": "6-3001",
        "accountName": "Biaya Gaji Office",
        "debit": 2280000.0,
        "credit": 0
      },
      {
        "id": "jl-36",
        "accountCode": "1-1003",
        "accountName": "Bank BCA-1 No.Rek : 5726088817",
        "debit": 0,
        "credit": 2280000.0
      }
    ],
    "isAdjustment": false,
    "postedAt": "2026-01-05"
  },
  {
    "id": "jrn-019",
    "voucherNumber": "JV-2026-01-019",
    "date": "2026-01-05",
    "month": 1,
    "referenceNumber": "005-BO2601",
    "description": "Pencatatan Biaya Gaji Office",
    "unit": "OVERHEAD_OPERASIONAL",
    "lines": [
      {
        "id": "jl-37",
        "accountCode": "6-3001",
        "accountName": "Biaya Gaji Office",
        "debit": 2030000.0,
        "credit": 0
      },
      {
        "id": "jl-38",
        "accountCode": "1-1003",
        "accountName": "Bank BCA-1 No.Rek : 5726088817",
        "debit": 0,
        "credit": 2030000.0
      }
    ],
    "isAdjustment": false,
    "postedAt": "2026-01-05"
  },
  {
    "id": "jrn-020",
    "voucherNumber": "JV-2026-01-020",
    "date": "2026-01-05",
    "month": 1,
    "referenceNumber": "005-BO2601",
    "description": "Pencatatan Biaya Gaji Office",
    "unit": "OVERHEAD_OPERASIONAL",
    "lines": [
      {
        "id": "jl-39",
        "accountCode": "6-3001",
        "accountName": "Biaya Gaji Office",
        "debit": 300000.0,
        "credit": 0
      },
      {
        "id": "jl-40",
        "accountCode": "1-1003",
        "accountName": "Bank BCA-1 No.Rek : 5726088817",
        "debit": 0,
        "credit": 300000.0
      }
    ],
    "isAdjustment": false,
    "postedAt": "2026-01-05"
  },
  {
    "id": "jrn-021",
    "voucherNumber": "JV-2026-01-021",
    "date": "2026-01-05",
    "month": 1,
    "referenceNumber": "005-BO2601",
    "description": "Pencatatan Biaya Gaji Office",
    "unit": "OVERHEAD_OPERASIONAL",
    "lines": [
      {
        "id": "jl-41",
        "accountCode": "6-3001",
        "accountName": "Biaya Gaji Office",
        "debit": 700000.0,
        "credit": 0
      },
      {
        "id": "jl-42",
        "accountCode": "1-1003",
        "accountName": "Bank BCA-1 No.Rek : 5726088817",
        "debit": 0,
        "credit": 700000.0
      }
    ],
    "isAdjustment": false,
    "postedAt": "2026-01-05"
  },
  {
    "id": "jrn-022",
    "voucherNumber": "JV-2026-01-022",
    "date": "2026-01-05",
    "month": 1,
    "referenceNumber": "005-BO2601",
    "description": "Pencatatan Biaya Sewa Alat",
    "unit": "OVERHEAD_OPERASIONAL",
    "lines": [
      {
        "id": "jl-43",
        "accountCode": "5-4007",
        "accountName": "Biaya Sewa Alat",
        "debit": 200000.0,
        "credit": 0
      },
      {
        "id": "jl-44",
        "accountCode": "1-1003",
        "accountName": "Bank BCA-1 No.Rek : 5726088817",
        "debit": 0,
        "credit": 200000.0
      }
    ],
    "isAdjustment": false,
    "postedAt": "2026-01-05"
  },
  {
    "id": "jrn-023",
    "voucherNumber": "JV-2026-01-023",
    "date": "2026-01-05",
    "month": 1,
    "referenceNumber": "006-BI2601",
    "description": "Pencatatan HiBank-2 No. Rek : 5302461653",
    "unit": "OVERHEAD_OPERASIONAL",
    "lines": [
      {
        "id": "jl-45",
        "accountCode": "1-1004",
        "accountName": "HiBank-2 No. Rek : 5302461653",
        "debit": 140250.0,
        "credit": 0
      },
      {
        "id": "jl-46",
        "accountCode": "1-1006",
        "accountName": "Pajak Dibayar Di Muka PPH 23",
        "debit": 0,
        "credit": 140250.0
      }
    ],
    "isAdjustment": false,
    "postedAt": "2026-01-05"
  },
  {
    "id": "jrn-024",
    "voucherNumber": "JV-2026-01-024",
    "date": "2026-01-05",
    "month": 1,
    "referenceNumber": "007-BO2601",
    "description": "Pencatatan Upah Borongan FTTH",
    "unit": "OVERHEAD_OPERASIONAL",
    "lines": [
      {
        "id": "jl-47",
        "accountCode": "5-1001",
        "accountName": "Upah Borongan FTTH",
        "debit": 11305000.0,
        "credit": 0
      },
      {
        "id": "jl-48",
        "accountCode": "1-1003",
        "accountName": "Bank BCA-1 No.Rek : 5726088817",
        "debit": 0,
        "credit": 11305000.0
      }
    ],
    "isAdjustment": false,
    "postedAt": "2026-01-05"
  },
  {
    "id": "jrn-025",
    "voucherNumber": "JV-2026-01-025",
    "date": "2026-01-05",
    "month": 1,
    "referenceNumber": "008-BO2601",
    "description": "Pencatatan Beban Transport & Perja-Din Office",
    "unit": "OVERHEAD_OPERASIONAL",
    "lines": [
      {
        "id": "jl-49",
        "accountCode": "6-4001",
        "accountName": "Beban Transport & Perja-Din Office",
        "debit": 1200000.0,
        "credit": 0
      },
      {
        "id": "jl-50",
        "accountCode": "1-1003",
        "accountName": "Bank BCA-1 No.Rek : 5726088817",
        "debit": 0,
        "credit": 1200000.0
      }
    ],
    "isAdjustment": false,
    "postedAt": "2026-01-05"
  },
  {
    "id": "jrn-026",
    "voucherNumber": "JV-2026-01-026",
    "date": "2026-01-05",
    "month": 1,
    "referenceNumber": "008-BI2601",
    "description": "Pencatatan Bank BCA-1 No.Rek : 5726088817",
    "unit": "OVERHEAD_OPERASIONAL",
    "lines": [
      {
        "id": "jl-51",
        "accountCode": "1-1003",
        "accountName": "Bank BCA-1 No.Rek : 5726088817",
        "debit": 132000.0,
        "credit": 0
      },
      {
        "id": "jl-52",
        "accountCode": "1-1006",
        "accountName": "Beban Transport & Perja-Din Office",
        "debit": 0,
        "credit": 132000.0
      }
    ],
    "isAdjustment": false,
    "postedAt": "2026-01-05"
  },
  {
    "id": "jrn-027",
    "voucherNumber": "JV-2026-01-027",
    "date": "2026-01-05",
    "month": 1,
    "referenceNumber": "009-BO2601",
    "description": "Pencatatan Upah Borongan FTTH",
    "unit": "OVERHEAD_OPERASIONAL",
    "lines": [
      {
        "id": "jl-53",
        "accountCode": "5-1001",
        "accountName": "Upah Borongan FTTH",
        "debit": 200000.0,
        "credit": 0
      },
      {
        "id": "jl-54",
        "accountCode": "1-1003",
        "accountName": "Bank BCA-1 No.Rek : 5726088817",
        "debit": 0,
        "credit": 200000.0
      }
    ],
    "isAdjustment": false,
    "postedAt": "2026-01-05"
  },
  {
    "id": "jrn-028",
    "voucherNumber": "JV-2026-01-028",
    "date": "2026-01-05",
    "month": 1,
    "referenceNumber": "009-BO2601",
    "description": "Pencatatan Upah Borongan FTTH",
    "unit": "OVERHEAD_OPERASIONAL",
    "lines": [
      {
        "id": "jl-55",
        "accountCode": "5-1001",
        "accountName": "Upah Borongan FTTH",
        "debit": 150000.0,
        "credit": 0
      },
      {
        "id": "jl-56",
        "accountCode": "1-1003",
        "accountName": "Bank BCA-1 No.Rek : 5726088817",
        "debit": 0,
        "credit": 150000.0
      }
    ],
    "isAdjustment": false,
    "postedAt": "2026-01-05"
  },
  {
    "id": "jrn-029",
    "voucherNumber": "JV-2026-01-029",
    "date": "2026-01-05",
    "month": 1,
    "referenceNumber": "009-BO2601",
    "description": "Pencatatan Upah Borongan FTTH",
    "unit": "OVERHEAD_OPERASIONAL",
    "lines": [
      {
        "id": "jl-57",
        "accountCode": "5-1001",
        "accountName": "Upah Borongan FTTH",
        "debit": 150000.0,
        "credit": 0
      },
      {
        "id": "jl-58",
        "accountCode": "1-1003",
        "accountName": "Bank BCA-1 No.Rek : 5726088817",
        "debit": 0,
        "credit": 150000.0
      }
    ],
    "isAdjustment": false,
    "postedAt": "2026-01-05"
  },
  {
    "id": "jrn-030",
    "voucherNumber": "JV-2026-01-030",
    "date": "2026-01-07",
    "month": 1,
    "referenceNumber": "010-BO2601",
    "description": "Pencatatan Petty Cash",
    "unit": "OVERHEAD_OPERASIONAL",
    "lines": [
      {
        "id": "jl-59",
        "accountCode": "1-1001",
        "accountName": "Petty Cash",
        "debit": 1000000.0,
        "credit": 0
      },
      {
        "id": "jl-60",
        "accountCode": "1-1003",
        "accountName": "Bank BCA-1 No.Rek : 5726088817",
        "debit": 0,
        "credit": 1000000.0
      }
    ],
    "isAdjustment": false,
    "postedAt": "2026-01-07"
  },
  {
    "id": "jrn-031",
    "voucherNumber": "JV-2026-01-031",
    "date": "2026-01-07",
    "month": 1,
    "referenceNumber": "011-BO2601",
    "description": "Pencatatan Biaya Gaji Karyawan Proyek",
    "unit": "ME_CORE",
    "lines": [
      {
        "id": "jl-61",
        "accountCode": "5-3001",
        "accountName": "Biaya Gaji Karyawan Proyek",
        "debit": 2000000.0,
        "credit": 0
      },
      {
        "id": "jl-62",
        "accountCode": "1-1003",
        "accountName": "Bank BCA-1 No.Rek : 5726088817",
        "debit": 0,
        "credit": 2000000.0
      }
    ],
    "isAdjustment": false,
    "postedAt": "2026-01-07"
  },
  {
    "id": "jrn-032",
    "voucherNumber": "JV-2026-01-032",
    "date": "2026-01-07",
    "month": 1,
    "referenceNumber": "012-BO2601",
    "description": "Pencatatan Low Value Asset",
    "unit": "OVERHEAD_OPERASIONAL",
    "lines": [
      {
        "id": "jl-63",
        "accountCode": "6-4020",
        "accountName": "Low Value Asset",
        "debit": 775000.0,
        "credit": 0
      },
      {
        "id": "jl-64",
        "accountCode": "1-1003",
        "accountName": "Bank BCA-1 No.Rek : 5726088817",
        "debit": 0,
        "credit": 775000.0
      }
    ],
    "isAdjustment": false,
    "postedAt": "2026-01-07"
  },
  {
    "id": "jrn-033",
    "voucherNumber": "JV-2026-01-033",
    "date": "2026-01-07",
    "month": 1,
    "referenceNumber": "012-BO2601",
    "description": "Pencatatan Low Value Asset",
    "unit": "OVERHEAD_OPERASIONAL",
    "lines": [
      {
        "id": "jl-65",
        "accountCode": "6-4020",
        "accountName": "Low Value Asset",
        "debit": 1500000.0,
        "credit": 0
      },
      {
        "id": "jl-66",
        "accountCode": "1-1003",
        "accountName": "Bank BCA-1 No.Rek : 5726088817",
        "debit": 0,
        "credit": 1500000.0
      }
    ],
    "isAdjustment": false,
    "postedAt": "2026-01-07"
  },
  {
    "id": "jrn-034",
    "voucherNumber": "JV-2026-01-034",
    "date": "2026-01-07",
    "month": 1,
    "referenceNumber": "012-BO2601",
    "description": "Pencatatan Low Value Asset",
    "unit": "OVERHEAD_OPERASIONAL",
    "lines": [
      {
        "id": "jl-67",
        "accountCode": "6-4020",
        "accountName": "Low Value Asset",
        "debit": 530000.0,
        "credit": 0
      },
      {
        "id": "jl-68",
        "accountCode": "1-1003",
        "accountName": "Bank BCA-1 No.Rek : 5726088817",
        "debit": 0,
        "credit": 530000.0
      }
    ],
    "isAdjustment": false,
    "postedAt": "2026-01-07"
  },
  {
    "id": "jrn-035",
    "voucherNumber": "JV-2026-01-035",
    "date": "2026-01-07",
    "month": 1,
    "referenceNumber": "011-BO2601",
    "description": "Pencatatan Biaya Gaji Karyawan Proyek",
    "unit": "ME_CORE",
    "lines": [
      {
        "id": "jl-69",
        "accountCode": "5-3001",
        "accountName": "Biaya Gaji Karyawan Proyek",
        "debit": 2000000.0,
        "credit": 0
      },
      {
        "id": "jl-70",
        "accountCode": "1-1003",
        "accountName": "Bank BCA-1 No.Rek : 5726088817",
        "debit": 0,
        "credit": 2000000.0
      }
    ],
    "isAdjustment": false,
    "postedAt": "2026-01-07"
  },
  {
    "id": "jrn-036",
    "voucherNumber": "JV-2026-01-036",
    "date": "2026-01-07",
    "month": 1,
    "referenceNumber": "011-BO2601",
    "description": "Pencatatan Biaya Gaji Karyawan Proyek",
    "unit": "ME_CORE",
    "lines": [
      {
        "id": "jl-71",
        "accountCode": "5-3001",
        "accountName": "Biaya Gaji Karyawan Proyek",
        "debit": 2000000.0,
        "credit": 0
      },
      {
        "id": "jl-72",
        "accountCode": "1-1003",
        "accountName": "Bank BCA-1 No.Rek : 5726088817",
        "debit": 0,
        "credit": 2000000.0
      }
    ],
    "isAdjustment": false,
    "postedAt": "2026-01-07"
  },
  {
    "id": "jrn-037",
    "voucherNumber": "JV-2026-01-037",
    "date": "2026-01-07",
    "month": 1,
    "referenceNumber": "011-BO2601",
    "description": "Pencatatan Biaya Gaji Karyawan Proyek",
    "unit": "ME_CORE",
    "lines": [
      {
        "id": "jl-73",
        "accountCode": "5-3001",
        "accountName": "Biaya Gaji Karyawan Proyek",
        "debit": 2000000.0,
        "credit": 0
      },
      {
        "id": "jl-74",
        "accountCode": "1-1003",
        "accountName": "Bank BCA-1 No.Rek : 5726088817",
        "debit": 0,
        "credit": 2000000.0
      }
    ],
    "isAdjustment": false,
    "postedAt": "2026-01-07"
  },
  {
    "id": "jrn-038",
    "voucherNumber": "JV-2026-01-038",
    "date": "2026-01-07",
    "month": 1,
    "referenceNumber": "011-BO2601",
    "description": "Pencatatan Biaya Gaji Karyawan Proyek",
    "unit": "ME_CORE",
    "lines": [
      {
        "id": "jl-75",
        "accountCode": "5-3001",
        "accountName": "Biaya Gaji Karyawan Proyek",
        "debit": 2000000.0,
        "credit": 0
      },
      {
        "id": "jl-76",
        "accountCode": "1-1003",
        "accountName": "Bank BCA-1 No.Rek : 5726088817",
        "debit": 0,
        "credit": 2000000.0
      }
    ],
    "isAdjustment": false,
    "postedAt": "2026-01-07"
  },
  {
    "id": "jrn-039",
    "voucherNumber": "JV-2026-01-039",
    "date": "2026-01-07",
    "month": 1,
    "referenceNumber": "011-BO2601",
    "description": "Pencatatan Beban Administrasi Bank",
    "unit": "OVERHEAD_OPERASIONAL",
    "lines": [
      {
        "id": "jl-77",
        "accountCode": "8-2001",
        "accountName": "Beban Administrasi Bank",
        "debit": 2500.0,
        "credit": 0
      },
      {
        "id": "jl-78",
        "accountCode": "1-1003",
        "accountName": "Bank BCA-1 No.Rek : 5726088817",
        "debit": 0,
        "credit": 2500.0
      }
    ],
    "isAdjustment": false,
    "postedAt": "2026-01-07"
  },
  {
    "id": "jrn-040",
    "voucherNumber": "JV-2026-01-040",
    "date": "2026-01-07",
    "month": 1,
    "referenceNumber": "013-BO2601",
    "description": "Pencatatan Upah Borongan FTTH",
    "unit": "OVERHEAD_OPERASIONAL",
    "lines": [
      {
        "id": "jl-79",
        "accountCode": "5-1001",
        "accountName": "Upah Borongan FTTH",
        "debit": 500000.0,
        "credit": 0
      },
      {
        "id": "jl-80",
        "accountCode": "1-1003",
        "accountName": "Bank BCA-1 No.Rek : 5726088817",
        "debit": 0,
        "credit": 500000.0
      }
    ],
    "isAdjustment": false,
    "postedAt": "2026-01-07"
  },
  {
    "id": "jrn-041",
    "voucherNumber": "JV-2026-01-041",
    "date": "2026-01-07",
    "month": 1,
    "referenceNumber": "014-BO2601",
    "description": "Pencatatan Advance Proyek Petty Cash",
    "unit": "ME_CORE",
    "lines": [
      {
        "id": "jl-81",
        "accountCode": "1-5001",
        "accountName": "Advance Proyek Petty Cash",
        "debit": 1000000.0,
        "credit": 0
      },
      {
        "id": "jl-82",
        "accountCode": "1-1003",
        "accountName": "Bank BCA-1 No.Rek : 5726088817",
        "debit": 0,
        "credit": 1000000.0
      }
    ],
    "isAdjustment": false,
    "postedAt": "2026-01-07"
  },
  {
    "id": "jrn-042",
    "voucherNumber": "JV-2026-01-042",
    "date": "2026-01-07",
    "month": 1,
    "referenceNumber": "014-BO2601",
    "description": "Pencatatan Advance Proyek Petty Cash",
    "unit": "ME_CORE",
    "lines": [
      {
        "id": "jl-83",
        "accountCode": "1-5001",
        "accountName": "Advance Proyek Petty Cash",
        "debit": 1000000.0,
        "credit": 0
      },
      {
        "id": "jl-84",
        "accountCode": "1-1003",
        "accountName": "Bank BCA-1 No.Rek : 5726088817",
        "debit": 0,
        "credit": 1000000.0
      }
    ],
    "isAdjustment": false,
    "postedAt": "2026-01-07"
  },
  {
    "id": "jrn-043",
    "voucherNumber": "JV-2026-01-043",
    "date": "2026-01-07",
    "month": 1,
    "referenceNumber": "015-BO2601",
    "description": "Pencatatan Biaya Sewa Kendaraan",
    "unit": "OVERHEAD_OPERASIONAL",
    "lines": [
      {
        "id": "jl-85",
        "accountCode": "5-4006",
        "accountName": "Biaya Sewa Kendaraan",
        "debit": 3000000.0,
        "credit": 0
      },
      {
        "id": "jl-86",
        "accountCode": "1-1003",
        "accountName": "Bank BCA-1 No.Rek : 5726088817",
        "debit": 0,
        "credit": 3000000.0
      }
    ],
    "isAdjustment": false,
    "postedAt": "2026-01-07"
  },
  {
    "id": "jrn-044",
    "voucherNumber": "JV-2026-01-044",
    "date": "2026-01-08",
    "month": 1,
    "referenceNumber": "016-BO2601",
    "description": "Pencatatan Biaya Gaji Office",
    "unit": "OVERHEAD_OPERASIONAL",
    "lines": [
      {
        "id": "jl-87",
        "accountCode": "6-3001",
        "accountName": "Biaya Gaji Office",
        "debit": 500000.0,
        "credit": 0
      },
      {
        "id": "jl-88",
        "accountCode": "1-1003",
        "accountName": "Bank BCA-1 No.Rek : 5726088817",
        "debit": 0,
        "credit": 500000.0
      }
    ],
    "isAdjustment": false,
    "postedAt": "2026-01-08"
  },
  {
    "id": "jrn-045",
    "voucherNumber": "JV-2026-01-045",
    "date": "2026-01-08",
    "month": 1,
    "referenceNumber": "017-Bi2601",
    "description": "Pencatatan HiBank-2 No. Rek : 5302461653",
    "unit": "OVERHEAD_OPERASIONAL",
    "lines": [
      {
        "id": "jl-89",
        "accountCode": "1-1004",
        "accountName": "HiBank-2 No. Rek : 5302461653",
        "debit": 30152720.0,
        "credit": 0
      },
      {
        "id": "jl-90",
        "accountCode": "1-1006",
        "accountName": "PT Integrasi Jaringan Ekosistem",
        "debit": 0,
        "credit": 30152720.0
      }
    ],
    "isAdjustment": false,
    "postedAt": "2026-01-08"
  },
  {
    "id": "jrn-046",
    "voucherNumber": "JV-2026-01-046",
    "date": "2026-01-09",
    "month": 1,
    "referenceNumber": "018-BI2601",
    "description": "Pencatatan HiBank-2 No. Rek : 5302461653",
    "unit": "OVERHEAD_OPERASIONAL",
    "lines": [
      {
        "id": "jl-91",
        "accountCode": "1-1004",
        "accountName": "HiBank-2 No. Rek : 5302461653",
        "debit": 30400000.0,
        "credit": 0
      },
      {
        "id": "jl-92",
        "accountCode": "1-1004",
        "accountName": "HiBank-2 No. Rek : 5302461653",
        "debit": 0,
        "credit": 30400000.0
      }
    ],
    "isAdjustment": false,
    "postedAt": "2026-01-09"
  },
  {
    "id": "jrn-047",
    "voucherNumber": "JV-2026-01-047",
    "date": "2026-01-09",
    "month": 1,
    "referenceNumber": "019-BO2601",
    "description": "Pencatatan Biaya Lain-Lain",
    "unit": "OVERHEAD_OPERASIONAL",
    "lines": [
      {
        "id": "jl-93",
        "accountCode": "8-2005",
        "accountName": "Biaya Lain-Lain",
        "debit": 500000.0,
        "credit": 0
      },
      {
        "id": "jl-94",
        "accountCode": "1-1003",
        "accountName": "Bank BCA-1 No.Rek : 5726088817",
        "debit": 0,
        "credit": 500000.0
      }
    ],
    "isAdjustment": false,
    "postedAt": "2026-01-09"
  },
  {
    "id": "jrn-048",
    "voucherNumber": "JV-2026-01-048",
    "date": "2026-01-09",
    "month": 1,
    "referenceNumber": "020-BO2601",
    "description": "Pencatatan Beban BPJS Kesehatan Office",
    "unit": "OVERHEAD_OPERASIONAL",
    "lines": [
      {
        "id": "jl-95",
        "accountCode": "6-3004",
        "accountName": "Beban BPJS Kesehatan Office",
        "debit": 13880481.0,
        "credit": 0
      },
      {
        "id": "jl-96",
        "accountCode": "1-1003",
        "accountName": "Bank BCA-1 No.Rek : 5726088817",
        "debit": 0,
        "credit": 13880481.0
      }
    ],
    "isAdjustment": false,
    "postedAt": "2026-01-09"
  },
  {
    "id": "jrn-049",
    "voucherNumber": "JV-2026-01-049",
    "date": "2026-01-09",
    "month": 1,
    "referenceNumber": "020-BO2601",
    "description": "Pencatatan Beban Administrasi Bank",
    "unit": "OVERHEAD_OPERASIONAL",
    "lines": [
      {
        "id": "jl-97",
        "accountCode": "8-2001",
        "accountName": "Beban Administrasi Bank",
        "debit": 2500.0,
        "credit": 0
      },
      {
        "id": "jl-98",
        "accountCode": "1-1003",
        "accountName": "Bank BCA-1 No.Rek : 5726088817",
        "debit": 0,
        "credit": 2500.0
      }
    ],
    "isAdjustment": false,
    "postedAt": "2026-01-09"
  },
  {
    "id": "jrn-050",
    "voucherNumber": "JV-2026-01-050",
    "date": "2026-01-09",
    "month": 1,
    "referenceNumber": "021-BO2601",
    "description": "Pencatatan Biaya Perizinan Proyek",
    "unit": "ME_CORE",
    "lines": [
      {
        "id": "jl-99",
        "accountCode": "5-4014",
        "accountName": "Biaya Perizinan Proyek",
        "debit": 1500000.0,
        "credit": 0
      },
      {
        "id": "jl-100",
        "accountCode": "1-1003",
        "accountName": "Bank BCA-1 No.Rek : 5726088817",
        "debit": 0,
        "credit": 1500000.0
      }
    ],
    "isAdjustment": false,
    "postedAt": "2026-01-09"
  }
];
