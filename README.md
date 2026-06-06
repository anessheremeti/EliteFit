# EliteFit 

EliteFit është një platformë gjithëpërfshirëse dhe interaktive për menaxhimin e fitnesit. Aplikacioni u mundëson përdoruesve të fitojnë medalje pas përfundimit të ushtrimeve, të mbajnë gjurmë (track) të progresit të tyre fizik, si dhe të menaxhojnë ushqyerjen dhe dietën e tyre. Përmes WebSockets, përdoruesit marrin njoftime në kohë reale.

Linku i repozitorit: [https://github.com/anessheremeti/EliteFit](https://github.com/anessheremeti/EliteFit)

##  Karakteristikat Kryesore
* **Sistemi i Shpërblimeve (Gamification):** Fitimi i medaljeve pas kompletimit të ushtrimeve.
* **Tracking i Ushtrimeve:** Historiku dhe progresi i aktiviteteve fizike.
* **Tracking i Ushqyerjes:** Gjurmimi ditor i ushqimit dhe dietës.
* **Njoftime në Kohë Reale:** Integrim me WebSockets për t'i mbajtur përdoruesit të përditësuar "real-time".

##  Teknologjitë e Përdorura
* **Frontend:** React.js
* **Backend:** .NET (C#)
* **Databazat:** MS SQL Server (për të dhëna relacionale) dhe MongoDB (për të dhëna jo-relacionale).
* **Real-time Communication:** WebSockets

---

##  Udhëzime të plota instalimi, konfigurimi dhe ekzekutimi të projektit

Ky seksion ofron hapat e detajuar për të konfiguruar dhe ekzekutuar projektin në një mjedis lokal.

### 1. Kërkesat Paraprake (Prerequisites)
Para se të filloni, sigurohuni që keni të instaluara në kompjuterin tuaj:
* [Node.js dhe npm](https://nodejs.org/) (për frontend-in)
* [.NET SDK](https://dotnet.microsoft.com/download) (për backend-in)
* [MS SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) dhe SSMS (SQL Server Management Studio)
* [MongoDB](https://www.mongodb.com/try/download/community) (lokal ose përmes MongoDB Atlas)

### 2. Klonimi i Repozitorit
Hapni terminalin dhe klononi projektin lokal:
```bash
git clone [https://github.com/anessheremeti/EliteFit.git](https://github.com/anessheremeti/EliteFit.git)
cd EliteFit
