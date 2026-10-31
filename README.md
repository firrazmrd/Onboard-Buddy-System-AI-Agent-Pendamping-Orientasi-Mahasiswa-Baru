# Onboard Buddy System: AI Agent Pendamping Orientasi dan Adaptasi Mahasiswa Baru

Capstone Project · Tema: **Onboard Buddy System**

## Daftar Isi

1. [Judul Capstone Project](#1-judul-capstone-project)
2. [Ringkasan Project](#2-ringkasan-project)
3. [Problem Statement](#3-problem-statement)
4. [Target Users](#4-target-users)
5. [Arsitektur Prompt (Prompt Layering)](#5-arsitektur-prompt-prompt-layering)
6. [Struktur File](#6-struktur-file)

---

## 1. Judul Capstone Project

**Onboard Buddy System: AI Agent Pendamping Orientasi dan Adaptasi Mahasiswa Baru**

Tema: Onboard Buddy System.

## 2. Ringkasan Project

Onboard Buddy System adalah dashboard web yang membantu mahasiswa baru menyelesaikan proses orientasi dengan terstruktur. Dashboard ini memuat checklist tugas (administrasi, akademik, sosial, teknis, dan kesehatan), jadwal kegiatan, pelacakan progres, profil buddy (mahasiswa senior pendamping), dan pengumuman. Project ini bertujuan membuat proses adaptasi mahasiswa baru lebih jelas, terpantau, dan tidak sepenuhnya bergantung pada ketersediaan buddy atau staf kampus. Permasalahan yang diselesaikan adalah informasi orientasi yang tersebar, tenggat tugas yang terlewat, dan beban buddy yang harus menjawab pertanyaan berulang.

Pengguna utama adalah mahasiswa baru, dengan buddy dan staf orientasi sebagai pengguna pendukung. AI Agent berfungsi sebagai asisten orientasi yang membaca data tugas, jadwal, dan pengumuman milik mahasiswa, lalu:

1. menjawab pertanyaan seputar proses orientasi,
2. memprioritaskan tugas berdasarkan tenggat dan tingkat kepentingan,
3. mengingatkan tugas yang mendekati atau melewati tenggat,
4. menyusun ringkasan progres mingguan, dan
5. mengeskalasi ke buddy atau staf ketika pertanyaan berada di luar kemampuannya.

## 3. Problem Statement

### Mengapa masalah ini penting

Masa orientasi menentukan seberapa cepat mahasiswa baru merasa terhubung dan siap belajar. Pada fase ini mahasiswa harus menyelesaikan banyak hal sekaligus: dokumen pendaftaran ulang, pengambilan kartu mahasiswa, aktivasi email kampus, pengisian rencana studi, pemeriksaan kesehatan, hingga mengikuti sesi orientasi. Kegagalan menyelesaikan salah satunya, misalnya terlambat registrasi mata kuliah, dapat berdampak langsung pada kelancaran perkuliahan.

### Kondisi saat ini

- Informasi orientasi tersebar di banyak kanal (email, grup chat, papan pengumuman, portal), sehingga mahasiswa sulit memastikan mana yang terbaru dan mana yang wajib.
- Mahasiswa baru sering tidak tahu urutan prioritas tugas, sehingga tugas penting dan tugas biasa diperlakukan sama.
- Buddy dan staf menerima pertanyaan yang sama berulang kali, misalnya lokasi kantor registrar, jam layanan, atau cara aktivasi email, dengan waktu respons yang bergantung pada ketersediaan mereka.
- Progres adaptasi tiap mahasiswa sulit dipantau, sehingga mahasiswa yang tertinggal baru diketahui setelah masalah muncul.
- Mahasiswa yang pemalu atau berasal dari luar kota sering segan bertanya, sehingga kebingungannya tidak terlihat.

### Dampak jika tidak ditangani

- Tenggat administrasi dan akademik terlewat, yang bisa berujung pada keterlambatan registrasi atau hambatan layanan kampus.
- Stres dan rasa terisolasi pada mahasiswa baru meningkat, yang berisiko menurunkan keterlibatan dan retensi.
- Beban buddy dan staf membengkak oleh pertanyaan administratif, sehingga waktu untuk pendampingan yang bermakna berkurang.
- Kampus tidak memiliki data yang cukup untuk mengidentifikasi mahasiswa yang membutuhkan bantuan lebih awal.

## 4. Target Users

### Pengguna utama: mahasiswa baru

| Aspek | Penjelasan |
|---|---|
| Peran dan karakteristik | Mahasiswa tahun pertama (umumnya 17–20 tahun), terbiasa dengan aplikasi mobile dan chat, tetapi belum mengenal sistem, lokasi, dan istilah di kampus. Sebagian merantau dan belum memiliki jaringan sosial di kampus. |
| Kebutuhan | Daftar tugas yang jelas dan berurutan prioritas; pengingat tenggat; jawaban cepat atas pertanyaan praktis kapan saja; kejelasan jadwal; jalur mudah untuk meminta bantuan manusia. |
| Alasan menjadi sasaran | Kelompok ini menanggung beban informasi terbesar dalam waktu singkat, paling rentan terlewat tenggat, dan paling diuntungkan oleh bantuan yang tersedia 24 jam tanpa rasa sungkan bertanya. |

### Pengguna pendukung: buddy (mahasiswa senior)

| Aspek | Penjelasan |
|---|---|
| Peran dan karakteristik | Mahasiswa tahun atas yang sukarela mendampingi satu atau beberapa mahasiswa baru di sela kesibukan kuliahnya. |
| Kebutuhan | Berkurangnya pertanyaan administratif berulang, serta ringkasan progres mahasiswa yang didampingi agar bisa fokus pada dukungan personal. |
| Alasan menjadi sasaran | Buddy adalah titik kontak manusia utama; agent yang menangani pertanyaan rutin membuat waktu mereka lebih berharga. |

### Pengguna pendukung: staf orientasi / administrator

| Aspek | Penjelasan |
|---|---|
| Kebutuhan | Pengumuman tersampaikan konsisten, tingkat penyelesaian tugas terpantau, dan kasus yang butuh intervensi dieskalasi dengan konteks yang jelas. |

## 5. Arsitektur Prompt (Prompt Layering)

AI Agent disusun dari enam layer prompt yang digabungkan secara berurutan pada setiap permintaan. Pemisahan layer membuat perilaku agent mudah diuji, diperbarui, dan dijaga konsistensinya: layer yang bersifat tetap (peran, aturan) terpisah dari layer yang berubah per pengguna (data dan pertanyaan).

| Layer | Nama | Sifat | Tujuan singkat |
|---|---|---|---|
| 1 | System / Role | Statis | Identitas dan gaya komunikasi agent |
| 2 | Context (Data Pengguna) | Dinamis | Data nyata mahasiswa dari dashboard |
| 3 | Knowledge & Policy | Statis | Membatasi sumber kebenaran pada informasi resmi |
| 4 | Task / Instruction | Dipilih per maksud | Langkah penalaran sesuai jenis pertanyaan |
| 5 | Output Format | Statis | Bentuk jawaban konsisten dan ringkas |
| 6 | Safety & Escalation | Statis | Perlindungan dan eskalasi ke manusia |

### Layer 1: System / Role Layer

**Tujuan:** menetapkan identitas, peran, dan gaya komunikasi agent agar konsisten.

**Prompt yang diterapkan:**

```text
Kamu adalah OnboardBuddy Assistant, asisten orientasi untuk mahasiswa baru.
Tugasmu membantu mahasiswa menyelesaikan proses orientasi: memahami tugas,
jadwal, dan informasi kampus. Gunakan bahasa Indonesia yang ramah, singkat,
dan suportif. Kamu bukan pengganti buddy manusia; kamu pelengkap yang
menangani pertanyaan praktis.
```

### Layer 2: Context Layer (Data Pengguna)

**Tujuan:** memberi agent data nyata milik mahasiswa yang sedang berinteraksi, sehingga jawaban personal dan tidak mengarang. Data diambil dari dashboard (daftar tugas, jadwal, pengumuman, dan buddy).

**Prompt yang diterapkan:**

```text
Tanggal hari ini: {tanggal}.
Profil mahasiswa: {nama}, {program_studi}, tahun pertama.
Buddy: {nama_buddy}.
Daftar tugas (judul, kategori, prioritas, tenggat, status): {tasks_json}.
Jadwal mendatang: {schedule_json}.
Pengumuman terbaru: {announcements_json}.
Progres saat ini: {persentase} selesai, {jumlah} tugas tersisa.
```

### Layer 3: Knowledge & Policy Layer

**Tujuan:** membatasi sumber kebenaran agent pada informasi resmi kampus (FAQ orientasi, lokasi layanan, jam operasional, prosedur), supaya jawaban akurat dan dapat dipertanggungjawabkan.

**Prompt yang diterapkan:**

```text
Jawab hanya berdasarkan data pada konteks dan basis pengetahuan orientasi
berikut: {faq_kampus}. Jika informasi tidak tersedia atau tidak pasti,
katakan terus terang bahwa kamu tidak tahu dan arahkan ke buddy atau staf.
Jangan mengarang tanggal, lokasi, biaya, atau kebijakan.
```

### Layer 4: Task / Instruction Layer

**Tujuan:** menentukan langkah penalaran dan jenis tindakan agent sesuai maksud pertanyaan (bertanya info, minta prioritas, minta pengingat, minta ringkasan).

**Prompt yang diterapkan:**

```text
Identifikasi maksud mahasiswa: (a) pertanyaan informasi, (b) minta prioritas
tugas, (c) minta pengingat, (d) minta ringkasan progres, atau (e) butuh
bantuan manusia. Untuk prioritas, urutkan tugas belum selesai berdasarkan
tenggat terdekat lalu tingkat prioritas (High, Medium, Low). Tandai tugas
yang lewat tenggat sebagai terlambat. Untuk ringkasan, sebutkan yang sudah
selesai, yang tersisa, dan satu langkah berikutnya yang paling disarankan.
```

### Layer 5: Output Format Layer

**Tujuan:** menjaga bentuk jawaban konsisten, ringkas, dan mudah dibaca di layar dashboard maupun ponsel.

**Prompt yang diterapkan:**

```text
Jawab maksimal 120 kata. Mulai dengan jawaban langsung. Gunakan daftar
bernomor hanya untuk lebih dari dua langkah atau tugas. Sebut judul tugas
dan tenggat dengan format tanggal yang jelas. Akhiri dengan satu saran
tindakan berikutnya atau satu pertanyaan lanjutan, tidak lebih.
```

### Layer 6: Safety & Escalation Layer

**Tujuan:** melindungi mahasiswa dan memastikan kasus sensitif ditangani manusia, bukan agent.

**Prompt yang diterapkan:**

```text
Jika mahasiswa menunjukkan tanda stres berat, masalah kesehatan mental,
keselamatan, diskriminasi, atau masalah keuangan, tanggapi dengan empati
singkat, jangan memberi diagnosis atau keputusan, dan arahkan ke buddy,
konselor, atau staf kampus yang relevan. Jangan meminta atau menyimpan data
sensitif seperti kata sandi atau nomor identitas. Jika pertanyaan di luar
topik orientasi, sampaikan dengan sopan bahwa kamu hanya dapat membantu
seputar orientasi.
```

### Alur Penggabungan Layer

1. Layer 1, 3, 5, dan 6 bersifat statis dan dimuat sebagai system prompt.
2. Layer 2 disusun ulang pada setiap permintaan dari data terbaru dashboard.
3. Layer 4 dipilih berdasarkan maksud pertanyaan.
4. Pertanyaan mahasiswa ditempatkan terakhir sebagai input pengguna.
5. Jika Layer 6 terpicu, jawaban agent diprioritaskan pada empati dan eskalasi, mengalahkan instruksi layer lain.

## 6. Struktur File

```text
.
├── index.html   # Struktur halaman dashboard (Tailwind CSS via CDN)
├── script.js    # Logika: navigasi, CRUD tugas, filter, KPI, jadwal, pengumuman
├── style.css    # Gaya tambahan dan animasi di luar utilitas Tailwind
└── README.md    # Dokumentasi capstone project
```

Cara menjalankan: buka `index.html` di browser. Data tugas dan pengumuman disimpan di `localStorage`.
