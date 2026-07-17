import type { MenuId, SectionId } from "@/components/dashboard/types";
import type { Language } from "@/lib/types";

const copy = {
  EN: {
    search: "Search...",
    notifications: "Notifications",
    profile: "Open account settings",
    weddingWorkspace: "Wedding workspace",
    invitedGuests: "143 invited guests",
    accountSettings: "Account settings",
    designEyebrow: "Design & Content",
    invitationSections: "Invitation sections",
    publishChanges: "Publish changes",
    published: "Published",
    backgroundMusic: "Background music",
    musicHelp: "Paste a YouTube URL to extract the audio preview.",
    pauseMusic: "Pause music preview",
    playMusic: "Play music preview",
    showSection: "Show section",
    coupleNames: "Couple names",
    weddingDate: "Wedding date",
    openingText: "Opening text",
    heroImage: "Hero image",
    uploadCover: "Upload cover photo",
    groomName: "Groom name",
    brideName: "Bride name",
    familyLine: "Family line",
    ceremonyTime: "Ceremony time",
    venue: "Venue",
    address: "Address",
    galleryImages: "Gallery images",
    uploadGallery: "Upload up to 12 photos",
    rsvpDeadline: "RSVP deadline",
    livePreview: "Live preview",
    mobileInvitation: "Mobile invitation",
    live: "Live",
    weddingOf: "The Wedding of",
    openInvitation: "Open invitation",
    brideAndGroom: "Bride & Groom",
    groom: "Groom",
    bride: "Bride",
    saveTheDate: "Save the date",
    attendQuestion: "Will you attend?",
    attend: "Attend",
    unable: "Unable",
    guestList: "Guest list",
    createGuest: "Create new guest",
    createGuestHelp: "Add a guest to your wedding invitation list.",
  },
  ID: {
    search: "Cari...",
    notifications: "Notifikasi",
    profile: "Buka pengaturan akun",
    weddingWorkspace: "Ruang kerja pernikahan",
    invitedGuests: "143 tamu diundang",
    accountSettings: "Pengaturan akun",
    designEyebrow: "Desain & Konten",
    invitationSections: "Bagian undangan",
    publishChanges: "Terbitkan perubahan",
    published: "Diterbitkan",
    backgroundMusic: "Musik latar",
    musicHelp: "Tempel URL YouTube untuk mengambil pratinjau audio.",
    pauseMusic: "Jeda pratinjau musik",
    playMusic: "Putar pratinjau musik",
    showSection: "Tampilkan bagian",
    coupleNames: "Nama pasangan",
    weddingDate: "Tanggal pernikahan",
    openingText: "Teks pembuka",
    heroImage: "Gambar utama",
    uploadCover: "Unggah foto sampul",
    groomName: "Nama mempelai pria",
    brideName: "Nama mempelai wanita",
    familyLine: "Keterangan keluarga",
    ceremonyTime: "Waktu acara",
    venue: "Lokasi",
    address: "Alamat",
    galleryImages: "Foto galeri",
    uploadGallery: "Unggah hingga 12 foto",
    rsvpDeadline: "Batas waktu RSVP",
    livePreview: "Pratinjau langsung",
    mobileInvitation: "Undangan seluler",
    live: "Aktif",
    weddingOf: "Pernikahan",
    openInvitation: "Buka undangan",
    brideAndGroom: "Mempelai",
    groom: "Mempelai pria",
    bride: "Mempelai wanita",
    saveTheDate: "Catat tanggalnya",
    attendQuestion: "Apakah Anda akan hadir?",
    attend: "Hadir",
    unable: "Tidak hadir",
    guestList: "Daftar tamu",
    createGuest: "Buat tamu baru",
    createGuestHelp: "Tambahkan tamu ke daftar undangan pernikahan Anda.",
  },
} as const;

export type TranslationKey = keyof typeof copy.EN;

export function tr(language: Language, key: TranslationKey) {
  return copy[language][key];
}

const menuCopy: Record<Language, Record<MenuId, string>> = {
  EN: {
    overview: "Dashboard",
    design: "Design",
    gifts: "Gifts",
    "guest-list": "Guest list",
    wablast: "WA blast",
    settings: "Invitation settings",
    account: "Account",
  },
  ID: {
    overview: "Dasbor",
    design: "Desain",
    gifts: "Hadiah",
    "guest-list": "Daftar tamu",
    wablast: "Siaran WA",
    settings: "Pengaturan undangan",
    account: "Akun",
  },
};

export function menuLabel(language: Language, id: MenuId) {
  return menuCopy[language][id];
}

const sectionCopy: Record<Language, Partial<Record<SectionId, { label: string; description: string }>>> = {
  EN: {
    hero: { label: "Hero banner", description: "Display the opening cover in the invitation." },
    couple: { label: "Bride & Groom", description: "Introduce the couple and family names." },
    event: { label: "Event details", description: "Show ceremony and reception information." },
    gallery: { label: "Gallery", description: "Display pre-wedding photos." },
    rsvp: { label: "RSVP", description: "Collect attendance confirmation from guests." },
  },
  ID: {
    hero: { label: "Sampul utama", description: "Tampilkan sampul pembuka pada undangan." },
    couple: { label: "Mempelai", description: "Perkenalkan pasangan dan nama keluarga." },
    event: { label: "Detail acara", description: "Tampilkan informasi akad dan resepsi." },
    gallery: { label: "Galeri", description: "Tampilkan foto pranikah." },
    rsvp: { label: "RSVP", description: "Kumpulkan konfirmasi kehadiran tamu." },
  },
};

export function sectionText(language: Language, id: SectionId) {
  return sectionCopy[language][id] || { label: id, description: "" };
}
