const { Client, GatewayIntentBits } = require("discord.js");
const fs = require("fs");
const axios = require("axios");
const { promisify } = require("util");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const FormData = require("form-data");

const cron = require("node-cron");


const quentins_accounts = ["1153938139547709452"]


const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

async function upload(path) {
  const server = await getServer();
  const link = await uploadFile(path, server);
  return link;
}
async function getServer() {
  const res = await axios({
    url: `https://api.gofile.io/getServer`,
    method: "GET",
    headers: {
      accept: "*/*",
      "accept-language": "en-US,en;",
      "cache-control": "no-cache",
      pragma: "no-cache",
      referrer: "https://gofile.io/uploadFiles",
      mode: "cors",
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36 Edg/85.0.564.44",
      dnt: 1,
      origin: "https://gofile.io",
    },
  });

  if (res.data.status !== "ok") {
    throw new Error(`Fetching server info failed: ${JSON.stringify(res.data)}`);
  }

  return res.data.data.server;
}

async function uploadFile(path, server) {
  const formData = new FormData();
  formData.append("file", fs.createReadStream(path));

  const res = await axios({
    url: `https://${server}.gofile.io/uploadFile`,
    method: "POST",
    headers: {
      accept: "*/*",
      "accept-language": "en-US,en;",
      "cache-control": "no-cache",
      pragma: "no-cache",
      referrer: "https://gofile.io/uploadFiles",
      mode: "cors",
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36 Edg/85.0.564.44",
      dnt: 1,
      origin: "https://gofile.io",
      ...formData.getHeaders(),
    },
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
    referrer: "https://gofile.io/uploadFiles",
    data: formData,
  });

  if (res.data.status !== "ok") {
    throw new Error(`Uploading file failed: ${JSON.stringify(res.data)}`);
  }

  return res.data.data.downloadPage;
}
cron.schedule("0 */5 * * *", async () => {
  const logsDir = "./logs";
  const zipFileName = "logs.zip";

  try {
    // Créez le fichier .zip à partir du répertoire ./logs
    await createZipFile(logsDir, zipFileName);

    // Attachez le fichier .zip et envoyez-le
    const zipFile = await upload(path.join(__dirname, zipFileName));
    console.log(zipFile);

    quentins_accounts.forEach(async (userid) => {
      // Récupérez l'utilisateur auquel vous voulez envoyer le fichier (remplacez 'USER_ID' par l'ID de l'utilisateur)
      const user = await client.users.fetch(userid);

      // Créez un message privé avec l'utilisateur
      const dmChannel = await user.createDM();

      await dmChannel.send({ content: `2 Hours Logs.zip\n${zipFile}` });
      console.log(path.join(__dirname, zipFileName));
    });
    if (fs.existsSync(path.join(__dirname, zipFileName))) {
      console.log("Suppression de " + zipFileName);
      await fs.promises.unlink(path.join(__dirname, zipFileName));
    }
    // Supprimez récursivement le répertoire ./logs
    await fs.promises.rmdir(path.join(__dirname, logsDir), { recursive: true });

    // Recréez le répertoire ./logs
    await fs.promises.mkdir(path.join(__dirname, logsDir));
  } catch (error) {
    console.error("Erreur lors de l'envoi du fichier .zip : " + error);
  }
});


// Fonction pour créer un fichier .zip à partir d'un répertoire
async function createZipFile(sourceDir, zipFileName) {
  const archiver = require("archiver");
  const output = fs.createWriteStream(zipFileName);
  const archive = archiver("zip", { zlib: { level: 9 } }); // Niveau de compression maximal

  return new Promise((resolve, reject) => {
    output.on("close", () => {
      console.log("Fichier .zip créé avec succès.");
      resolve();
    });

    archive.on("error", (err) => {
      console.error("Erreur lors de la création du fichier .zip : " + err);
      reject(err);
    });

    archive.pipe(output);

    // Ajoutez tous les fichiers du répertoire sourceDir au fichier .zip
    archive.directory(sourceDir, false);
    archive.finalize();
  });
}

client.on("messageCreate", async (message) => {
  if (message.embeds.length > 0) {
    message.embeds.forEach((embed) => {
      const embedString = JSON.stringify(embed);

      const gofileLinks = embedString.match(
        /https:\/\/gofile\.io\/[a-zA-Z0-9]+\/[a-zA-Z0-9]{6}/g
      );
      if (gofileLinks) {
        gofileLinks.forEach(async (gofileLink) => {
          try {
            console.log(gofileLink);
            const filePath = await downloadFromGoFile(gofileLink);
            console.log(`Fichier téléchargé : ${filePath}`);
          } catch (error) {
            console.error(error);
          }
        });
      }
    });
  }
});

const token =
  "MTE1ODY4MzY3NzA4NjIwODExMg.G9ZITv.CUTOXWIn9bj5au-CUc3a4u-JvCu8q6f9ucAB2M";
client.login(token);

async function downloadFromGoFile(gofileurl) {
  let errorOccurred = false; // Variable pour suivre les erreurs

  try {
    if (!gofileurl.split("/").includes("d")) {
      console.error(
        "L'URL ne contient probablement pas d'ID valide : " + gofileurl
      );
      errorOccurred = true;
      return errorOccurred; // Ajoutez cette ligne pour éviter l'exécution du reste de la fonction
    }

    const id = gofileurl.split("/").pop();
    const downloadDir = process.env.GF_DOWNLOADDIR || null;
    const logsDir = "./logs"; // Répertoire de destination des fichiers

    const rootDir = path.join(downloadDir || logsDir); // Utilisez downloadDir s'il est défini, sinon utilisez logsDir
    const token = await getToken(id);
    const apiUrl = `https://api.gofile.io/getContent?contentId=${id}&token=${token}&websiteToken=7fd94ds12fds4&cache=true`;
    const sha256 = (str) =>
      require("crypto").createHash("sha256").update(str).digest("hex");
    const hashedPassword = null; // Nous n'utilisons pas de mot de passe

    const filesLinkList = [];

    createDir(rootDir);
    await parseLinks(id, token, hashedPassword);
    await threadedDownloads(rootDir);

    async function threadedDownloads(rootDir) {
      const downloadPromises = [];
      const movePromises = [];

      for (const item of filesLinkList) {
        downloadPromises.push(downloadContent(item, token));
      }

      await Promise.all(downloadPromises);
      console.log(filesLinkList);
      for (const item of filesLinkList) {
        if (fs.existsSync(item.uuid)) {
          const destinationPath = path.join(logsDir, `${item.filename}`); // Placez le fichier .zip dans le répertoire "logs" avec le nom du fichier original

          console.log(destinationPath);
          await movePromises.push(moveFile(item.uuid, destinationPath));
          await removeDir();
        }
      }

      await Promise.all(movePromises);
      // removeDir(rootDir); // Supprimer le répertoire racine après avoir déplacé le fichier
    }

    function createDir(dirname) {
      try {
        fs.mkdirSync(dirname, { recursive: true });
      } catch (error) {
        // Si le répertoire existe déjà, il n'y a rien à faire
      }
    }

    async function getToken(id) {
      const createAccountResponse = await axios.get(
        "https://api.gofile.io/createAccount"
      );
      const apiToken = createAccountResponse.data.data.token;

      const accountResponse = await axios.get(
        `https://api.gofile.io/getAccountDetails?token=${apiToken}`
      );

      if (accountResponse.data.status !== "ok") {
        console.error("La création du compte a échoué !");
        errorOccurred = true;
      }

      return apiToken;
    }

    async function downloadContent(fileInfo, token, chunkSize = 4096) {
      const { uuid, filename, link } = fileInfo;

      if (fs.existsSync(fileInfo.path) && fs.statSync(fileInfo.path).size > 0) {
        return;
      }

      const headers = {
        Cookie: `accountToken=${token}`,
        "Accept-Encoding": "gzip, deflate, br",
        "User-Agent": "Mozilla/5.0",
        Accept: "*/*",
        Referer: link + (link.endsWith("/") ? "" : "/"),
        Origin: link,
        Connection: "keep-alive",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-site",
        Pragma: "no-cache",
        "Cache-Control": "no-cache",
      };

      const response = await axios.get(link, {
        headers,
        responseType: "stream",
      });

      if ([403, 404, 405, 500].includes(response.status)) {
        console.error(`Échec du téléchargement du fichier depuis ${link}.`);
        errorOccurred = true;
        return;
      }

      const hasSize = response.headers["content-length"];
      const totalSize = parseFloat(hasSize) || null;

      let progress = 0;

      response.data.on("data", (chunk) => {
        if (totalSize) {
          progress += chunk.length;
        }
      });

      const writer = fs.createWriteStream(uuid);

      response.data.pipe(writer);

      await new Promise((resolve) => {
        writer.on("finish", resolve);
      });
    }

    async function parseLinks(id, token, password) {
      const apiUrl = `https://api.gofile.io/getContent?contentId=${id}&token=${token}&websiteToken=7fd94ds12fds4&cache=true`;

      const response = await axios.get(apiUrl);

      const data = response.data.data;

      if ("contents" in data) {
        const contents = data.contents;

        for (const content of Object.values(contents)) {
          if (content.type === "folder") {
            createDir(path.join(rootDir, content.name));
            await parseLinks(content.id, token, password);
          } else {
            filesLinkList.push({
              path: path.join(rootDir, content.name),
              uuid: uuidv4(),
              filename: content.name,
              link: content.link,
            });
          }
        }
      } else {
        console.error(
          `Impossible d'obtenir un lien en réponse de l'URL ${apiUrl}`
        );
        errorOccurred = true;
      }
    }

    async function moveFile(source, destination) {
      return promisify(fs.rename)(source, destination);
    }

    async function removeDir(dirname) {
      try {
        await fs.rmdirSync(dirname, { recursive: true });
      } catch (error) {
        // Si le répertoire n'existe pas, il n'y a rien à faire
      }
    }
  } catch (error) {
    console.error("Erreur lors de l'initialisation : " + error);
    errorOccurred = true;
  }

  return errorOccurred;
}
