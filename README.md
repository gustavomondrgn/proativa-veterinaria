# Proativa Clínica Veterinária

Landing page institucional e de conversão da Proativa Clínica Veterinária — atendimento veterinário 24h em Sete Lagoas/MG.

**Site:** https://proativaveterinaria.com.br

## Stack

- HTML5 semântico
- CSS3 puro (sem preprocessador, sem build step)
- JavaScript vanilla
- Hospedagem: HostGator (cPanel)
- Deploy: GitHub Actions → FTP automático em push pra `main`

## Estrutura

```
.
├── .github/workflows/   # Deploy automatizado
├── assets/              # Imagens e ícones
├── css/                 # Estilos
├── js/                  # Scripts (tracking, consent LGPD, etc.)
├── index.html           # Landing principal
├── termos.html          # Termos de Uso
├── privacidade.html     # Política de Privacidade
├── 404.html             # Erro 404 customizado
├── .htaccess            # Apache (GZIP, cache, redirects, headers)
├── robots.txt
└── sitemap.xml
```

## Desenvolvimento local

Abrir `index.html` direto no navegador ou usar uma extensão de servidor estático (Live Server no VS Code).

## Deploy

Push em `main` aciona o workflow `.github/workflows/deploy.yml`, que sincroniza os arquivos via FTP pro HostGator.

## Contato

Proativa Clínica Veterinária — Rua José Gonçalves de Oliveira, 279 — Canaan, Sete Lagoas/MG
Telefones: (31) 99878-6181 · (31) 3771-2957
