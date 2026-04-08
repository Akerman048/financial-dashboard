import { storage } from "./firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export async function uploadUserAvatar(file: File, userId: string) {
  const fileRef = ref(storage, `avatars/${userId}/${Date.now()}-${file.name}`);

  await uploadBytes(fileRef, file);

  const url = await getDownloadURL(fileRef);

  return url;
}