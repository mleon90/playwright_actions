// @ts-check
const { test, expect } = require('@playwright/test');
const { FJ } = require('./funciones_curso');   // Importar FJ, no F
const dotenv = require('dotenv');
const XLSX = require('xlsx');

dotenv.config();

const tp = 500;
const datos = ['Marcela', 'Villanueva', 'rod@gmail.com', '34545', 'Dirección uno', 'Sports'];

// ---------------- Test simple ----------------
test('Parametros', async ({ page }) => {
  const f = new FJ(page);
  await f.openURL("https://demoqa.com/automation-practice-form");
  await f.scroll(0, 500);

  await page.check('#hobbies-checkbox-3'); // ejemplo directo
});

// ---------------- Test con variables de ambiente ----------------
test('Variables de Ambiente', async ({ page }) => {
  page.setDefaultTimeout(30000);
  const f = new FJ(page);

  await f.openURL("https://demoqa.com/automation-practice-form");
  await f.scroll(0, 500);

  await f.texto("#firstName", process.env.NOMBRE || "", tp);
  await f.texto("#lastName", process.env.APELLIDO || "", tp);
  await f.texto("#userEmail", process.env.EMAIL || "", tp);
  await f.texto("#userNumber", process.env.TELEFONO || "", tp);
  await f.texto("#currentAddress", process.env.DIRECCION || "", tp);

  switch (process.env.HOBBY2?.toUpperCase()) {
    case "SPORTS":
      await page.check("#hobbies-checkbox-1");
      break;
    case "READING":
      await page.check("#hobbies-checkbox-2");
      break;
    case "MUSIC":
      await page.check("#hobbies-checkbox-3");
      break;
    default:
      console.log("Ninguna opción de hobby es válida");
  }
});

// ---------------- Test con Excel ----------------
const libroXL = XLSX.readFile('Data.xlsx');
const hoja = libroXL.SheetNames[0];
const excel = XLSX.utils.sheet_to_json(libroXL.Sheets[hoja]);

test.only('Data Excel', async ({ page }) => {
  page.setDefaultTimeout(80000);
  const f = new FJ(page);

  for (const fila of excel) {
    await f.openURL("https://demoqa.com/automation-practice-form");

    await f.texto("#firstName", fila["nombre"] || "", tp);
    await f.texto("#lastName", fila["apellido"] || "", tp);
    await f.texto("#userEmail", fila["email"] || "", tp);
    await f.texto("#userNumber", fila["tel"]?.toString() || "", tp);
    await f.texto("#currentAddress", fila["direccion"] || "", tp);

    await page.click("#submit");
  }
});
