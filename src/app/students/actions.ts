'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export async function addStudent(formData: FormData) {
  const supabase = await createClient();
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const department = formData.get('department') as string;
  const cgpa = parseFloat(formData.get('cgpa') as string);

  await supabase.from('students').insert([{ name, email, department, cgpa }]);
  revalidatePath('/students');
}
