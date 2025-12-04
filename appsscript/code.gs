/**
 * Função principal que é executada quando o script é acessado (doGet).
 * Ela serve o arquivo HTML.
 */
function doGet() {
  // O nome do arquivo HTML a ser servido
  const htmlTemplate = HtmlService.createTemplateFromFile('Index');
  
  // Define o título da página
  htmlTemplate.pageTitle = "Filarmônica 5 de Junho";

  // Renderiza o HTML e define o modo de sandboxing
  return htmlTemplate.evaluate()
      .setTitle(htmlTemplate.pageTitle)
      .addMetaTag('viewport', 'width=device-width, initial-scale=1')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Função chamada pelo JavaScript no cliente para buscar os dados da planilha.
 * @returns {Array<Object>} Uma lista de objetos com os dados das músicas.
 */
function getAcervoMusical() {
  const SPREADSHEET_NAME = "Banco de Partituras"; // Mude para o nome exato da sua planilha
  const SHEET_NAME = "Músicas"; // Mude para o nome da aba onde estão os dados

  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet() || SpreadsheetApp.openByName(SPREADSHEET_NAME);
    const sheet = ss.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      Logger.log('Erro: Aba não encontrada.');
      return [];
    }

    // Pega todos os dados (exceto a linha do cabeçalho)
    const range = sheet.getDataRange();
    const values = range.getValues();
    
    if (values.length < 2) {
      // Retorna vazio se só tiver o cabeçalho
      return [];
    }
    
    // Nomes das colunas para mapeamento (devem ser exatamente iguais ao cabeçalho)
    const headers = values[0]; 
    const data = values.slice(1); // Ignora a linha do cabeçalho

    const acervo = data.map(row => {
      const musica = {};
      musica[headers[0]] = row[0]; // Título
      musica[headers[1]] = row[1]; // Compositor
      musica[headers[2]] = row[2]; // Categoria
      musica[headers[3]] = row[3]; // Link_PDF
      musica[headers[4]] = row[4]; // Link_Audio
      
      return musica;
    });

    return acervo;

  } catch (e) {
    Logger.log('Erro ao ler a planilha: ' + e.toString());
    return [];
  }
}
