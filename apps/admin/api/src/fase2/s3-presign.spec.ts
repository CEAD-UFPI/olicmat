import { presign, s3ConfigDoAmbiente } from "./s3-presign.js";

// Vetor de teste oficial da AWS (SigV4, query string):
// https://docs.aws.amazon.com/AmazonS3/latest/API/sigv4-query-string-auth.html
describe("presign (SigV4)", () => {
  const aws = {
    endpoint: "https://examplebucket.s3.amazonaws.com",
    region: "us-east-1",
    bucket: "",
    accessKey: "AKIAIOSFODNN7EXAMPLE",
    secretKey: "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
  };

  it("reproduz a assinatura do exemplo da documentação da AWS", () => {
    // O exemplo usa estilo virtual-host (bucket no host), daí bucket vazio.
    const url = presign(aws, "GET", "test.txt", {
      expiraEmSegundos: 86400,
      agora: new Date("2013-05-24T00:00:00Z"),
    });
    expect(url).toContain("X-Amz-Signature=aeeed9bbccd4d02ee5c0109b86d86835f995330da4c265957d157751f604d404");
  });

  it("codifica a chave por segmento e inclui sub-recursos", () => {
    const url = presign({ ...aws, endpoint: "https://s3.exemplo.com", bucket: "b" }, "PUT", "fase2/a b/ç.mp4", {
      query: { partNumber: "3", uploadId: "x/y" },
      agora: new Date("2026-11-17T12:00:00Z"),
    });
    expect(url.startsWith("https://s3.exemplo.com/b/fase2/a%20b/%C3%A7.mp4?")).toBe(true);
    expect(url).toContain("partNumber=3");
    expect(url).toContain("uploadId=x%2Fy");
    expect(url).toContain("X-Amz-Date=20261117T120000Z");
  });

  it("configuração só existe com endpoint, bucket e chaves", () => {
    expect(s3ConfigDoAmbiente({})).toBeNull();
    expect(
      s3ConfigDoAmbiente({ FASE2_S3_ENDPOINT: "https://s3.x.com/", FASE2_S3_BUCKET: "b", FASE2_S3_ACCESS_KEY: "k", FASE2_S3_SECRET_KEY: "s" }),
    ).toEqual({ endpoint: "https://s3.x.com", region: "us-east-1", bucket: "b", accessKey: "k", secretKey: "s" });
  });
});
