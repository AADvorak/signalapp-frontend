import ApiProvider from "~/api/api-provider";

const FileUtils = {

  /**
   * @param {Signal} signal
   */
  saveSignalToTxtFile(signal) {
    this.saveToFile('data:text/plain;charset=utf-8,' + encodeURIComponent(this.signalDataToTxt(signal.data)),
        this.getFileNameWithExtension(signal.name, '.txt'))
  },

  saveSignalToWavFile(signal) {
    this.saveToFile( ApiProvider.BASE_URL + '/api/signals/' + signal.id + '/wav',
        this.getFileNameWithExtension(signal.name, '.wav'))
  },

  saveBlobToWavFile({blob, fileName}) {
    this.saveToFile(URL.createObjectURL(blob), fileName)
  },

  saveToFile(href, fileName) {
    let element = document.createElement('a')
    element.setAttribute('href', href)
    element.setAttribute('download', fileName)
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  },

  readSignalFromTxtFile(file) {
    return this.readFromFile(file).then(result => this.txtToSignalData(result))
  },

  readSignalFromWavFile(file) {
    return this.readFromFile(file, 'readAsArrayBuffer')
  },

  readFromFile(file, readFunc) {
    return new Promise((resolve, reject) => {
      let reader = new FileReader()
      reader[readFunc || 'readAsText'](file)
      reader.onload = () => {
        resolve(reader.result)
      }
      reader.onerror = (error) => {
        reject(error)
      }
    })
  },

  txtToSignalData(txt) {
    let data = []
    let strArr = txt.split('\n')
    for (let str of strArr) {
      let values = str.split(' ')
      let item = {
        x: values[0],
        y: values[1]
      }
      if (item.x && item.y) {
        data.push({
          x: parseFloat(values[0]),
          y: parseFloat(values[1])
        })
      }
    }
    return data
  },

  /**
   * @param {SignalData[]} data
   */
  signalDataToTxt(data) {
    let txt = ''
    for (let item of data) {
      txt += `${item.x} ${item.y}\n`
    }
    return txt
  },

  getFileNameWithExtension(name, extension) {
    return name + (name.endsWith(extension) ? '' : extension)
  }

}

export default FileUtils