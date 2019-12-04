export const collectBody = (req, isJSON = true) => new Promise((resolve, reject) => {
  const data = []
  req
    .on('data', ch => data.push(ch))
    .on('end', () => {
      const response = Buffer.concat(data).toString('utf-8')
      resolve(isJSON ? JSON.parse(response) : response)
    })
    .on('error', reject)
})
