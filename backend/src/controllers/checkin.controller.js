const { Guest } = require('../models');

exports.handleCheckin = async (req, res) => {
  try {
    const { guestId } = req.body;

    // 1. Validasi input: pastikan guestId ada
    if (!guestId) {
      return res.status(400).json({ status: 'error', message: 'Guest ID is required' });
    }

    // 2. Cari tamu di database berdasarkan ID dari QR Code
    const guest = await Guest.findByPk(guestId);

    // 3. Jika tamu tidak ditemukan
    if (!guest) {
      return res.status(404).json({ status: 'error', message: 'QR Code not valid. Guest not found.' });
    }

    // 4. Jika tamu sudah pernah check-in sebelumnya
    if (guest.status === 'checked_in') {
      return res.status(409).json({ // 409 Conflict adalah status yang tepat
        status: 'conflict',
        message: 'Guest already checked in',
        data: guest, // Kirim data tamu agar bisa ditampilkan
      });
    }

    // 5. Jika semua aman (tamu ada dan belum check-in), lakukan proses check-in
    guest.status = 'checked_in';
    guest.checkedInAt = new Date();
    await guest.save();

    // 6. Kirim respons sukses
    return res.status(200).json({
      status: 'success',
      message: 'Check-in successful',
      data: guest,
    });

  } catch (error) {
    // Tangani error tak terduga
    console.error('Check-in error:', error);
    return res.status(500).json({ status: 'error', message: 'Internal server error during check-in' });
  }
};