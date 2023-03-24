import fetch from "node-fetch"


export class GitLabOauthService {
    constructor(clientId, clientSecret, redirectUri, baseURL) {
      this.clientId = clientId
      this.clientSecret = clientSecret
      this.redirectUri = redirectUri
      this.scope = 'openid'
      this.baseURL = baseURL
    }
  
    getAuthorizationUrl() {
      const url = `${this.baseURL}/oauth/authorize?client_id=${this.clientId}&redirect_uri=${this.redirectUri}&response_type=code&scope=${encodeURIComponent(this.scope)}`;
      return url
    }
  
    async getAccessData(code) {
      const formData = new URLSearchParams()
      formData.append('client_id', this.clientId)
      formData.append('client_secret', this.clientSecret)
      formData.append('code', code)
      formData.append('grant_type', 'authorization_code')
      formData.append('redirect_uri', this.redirectUri)
  
      const response = await fetch(`${this.baseURL}/oauth/token`, {
        method: 'POST',
        body: formData,
      })
  
      const data = await response.json()

      return data
    }
  }