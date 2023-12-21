const resApi = {
    Notfound: (res, message = "Sumber daya yang diminta tidak ditemukan..") => res.status(404).json({ message }),
    Forbidden: (res, message = "Anda tidak memiliki izin untuk mengakses sumber daya ini.") => res.status(403).json({ message }),
    Unauthorized: (res, message = "Token Tidak Valid") => res.status(401).json({ message }),
    ServerError: (res, message = "Terjadi kesalahan di pihak server yang tidak dapat diantisipasi.") => res.status(500).json({ message }),
    GateWayTimeout: (res, message = "Waktu untuk menerima respons dari server lain telah habis.") => res.status(504).json({ message }),
    Success: (res, message = "Permintaan berhasil.", items) => res.status(200).json({ message, items }),
    SuccessCreate: (res, message = "Permintaan berhasil, sumber daya telah dibuat.") => res.status(201).json({ message }),
    ErrorCreate: (res, message = "Permintaan tidak dapat dipahami atau ada kesalahan sintaks.") => res.status(400).json({ message }),
}

module.exports = resApi