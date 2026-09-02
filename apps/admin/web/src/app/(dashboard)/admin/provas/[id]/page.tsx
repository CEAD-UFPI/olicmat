"use client";

import { ProvaEditor } from "@/components/prova/ProvaEditor";

export default function AdminProvaDetalhePage() {
  return <ProvaEditor basePath="/admin" showErrorBackButton idSuffix="-adm" />;
}
