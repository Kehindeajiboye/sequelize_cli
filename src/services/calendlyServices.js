require('dotenv').config()
const axios = require('axios')


const getAccessToken = async () => {
    try {
        const response = await axios.post(
            'https://stoplight.io/mocks/calendly/api-docs/591407/oauth/token',
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: `Basic ${process.env.CALENDLY_CLIENT_ID}${process.env.CALENDLY_CLIENT_SECRET}`
                },
            }
        )
        return response.data
    } catch (error) {
        throw error
    }
}

const getAuthorizationCode = async () => {
    try {
        const response = await axios.get(
            'https://stoplight.io/mocks/calendly/api-docs/591407/oauth/authorize',
            {
                params: {
                    response_type: 'code',
                    redirect_uri: 'https://localhost:2003/auth/calendly',
                    code_challenge_method: 'S256'
                }
            },
            {
                headers: { 'Content-Type': 'application/json' },
            }
        )
        return response.data
    } catch (error) {
        throw error
    }
}

const scheduleLinkService = async (data) => {
    const token = getAccessToken()
    console.log('toks', token)
    try {
        const response = await axios.post(
            'https://api.calendly.com/scheduling_links',
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
            },
            {
                data: {
                   max_event_count: data.max_event_count,
                   owner: data.owner,
                   owner_type: data.owner_type
                }
            }
        )
        return response.data
    } catch (error) {
        throw error
    }
}

module.exports = {
    getAccessToken,
    scheduleLinkService
}