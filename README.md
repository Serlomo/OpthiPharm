###### Opti Pharm

### Index
- Agenda de tasques.
- Iniciar el programa.
- Iniciar el programa desprès de fer tota l'instal·lació
- Iniciar el programa
- Documentació

### Agenda


### Iniciar el programa PER PRIMERA VEGADA

Primer de tot descarregat el programa Git en el teu pc. https://git-scm.com/

Desprès hem d'introduir les nostres dades al programa de git:

Hem d'escollir un username: `$ git config --global user.name "John Doe"`
Hem d'associar-lo amb un Gmail nostre:`$ git config --global user.email johndoe@example.com`

Nosaltres per baixar-nos el codi anirem a la pestanya de la dreta i farem clic en DOWNLOAD ZIP.

Descarregar Visual Code: https://code.visualstudio.com/

Després el podem obrir amb Visual Code y instal·lar-nos tots els paques necessaris.

Quan obrirem l'IDE ens trobem una pestanya a l'esquerra que és com uns quadrats, entrem i en el buscador que s'apareix busquem tots els paquets que calen instal·lar-los.

Paquets a instal·lar:

- Live Share ------------------ Obligatori
- Material Icon Theme --------- Recomanat
- Prettier - Code formatter --- Recomanat

### Iniciar el programa desprès de fer tota l'instal·lació

Sempre que vulga'm treballar hem d'anar a la carpeta del projecte i executar a la cmd `git pull` el que farem és baixar-nos el codi més actualitzat de l'aplicació.

El que farem serà dirigir-nos al directori principal amb la cmd: Backend-OpthiPharm o Frontend i executarem `npm install`. Desprès podrem executar el codi `npm start`.

Quan acabem de treballar hem d'executar `git add .` El que fem és afegir tots els canvis per preparar la pujada.
Seguidament hem d'excutar `git commit -m"El que hem realitzat o modificat"`
Per últim hem d'excutar `git push` el que farà és pujar tots els canvis al repositori.

### Iniciar el programa

El que farem serà dirigir-nos al directori principal amb la cmd: Backend-OpthiPharm o Frontend i executarem `npm start` per iniciar els programes.