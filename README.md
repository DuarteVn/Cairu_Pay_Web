
  # CairuPay Desktop App UI

  This is a code bundle for CairuPay Desktop App UI. The original project is available at https://www.figma.com/design/B7TLoWnt4aFJJfEcFrmCj1/CairuPay-Desktop-App-UI.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  ## Backend (Spring) — credenciais locais

  O arquivo `backend/src/main/resources/application.properties` **não é versionado** (contém credenciais).

  Para configurar localmente:

  - Copie o exemplo:
    - Windows (PowerShell): `Copy-Item backend/src/main/resources/application.properties.example backend/src/main/resources/application.properties`
  - Edite o `application.properties` com as credenciais do seu banco.
  