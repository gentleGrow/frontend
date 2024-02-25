# Library
from authlib.integrations.starlette_client import OAuth
from os import getenv
from dotenv import load_dotenv

load_dotenv()
oauth = OAuth()

# [정보] 구글 configuration
GOOGLE_CLIENT_ID = getenv('GOOGLE_CLIENT_ID', None)
GOOGLE_CLIENT_SECRET = getenv('GOOGLE_CLIENT_SECRET', None)

oauth.register(
    name='google',
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_id=GOOGLE_CLIENT_ID,
    client_secret=GOOGLE_CLIENT_SECRET,
    client_kwargs={
        'scope': 'email openid profile',
        # 'redirect_url': 'http://localhost:8000/'
    }
)


# [정보] 카카오 configuration
KAKAO_CLIENT_RESTAPI_KEY = getenv('KAKAO_CLIENT_RESTAPI_KEY', None)
KAKAO_CLIENT_SECRET = getenv('KAKAO_CLIENT_SECRET',None)

oauth.register(
    name='kakao',
    client_id=KAKAO_CLIENT_RESTAPI_KEY,
    authorize_url='https://kauth.kakao.com/oauth/authorize',
    authorize_params=None,
    access_token_url='https://kauth.kakao.com/oauth/token',
    access_token_params=None,
    refresh_token_url=None,
    redirect_uri='http://127.0.0.1:8000/api/auth/kakao/callback',
    client_kwargs={
        'scope': 'profile_nickname profile_image friends',
    }
)

NAVER_CLIENT_ID = getenv('NAVER_CLIENT_ID', None)
NAVER_CLIENT_SECRET = getenv('NAVER_CLIENT_SECRET', None)


oauth.register(
    name='naver',
    client_id=NAVER_CLIENT_ID,
    client_secret=NAVER_CLIENT_SECRET,
    authorize_url='https://nid.naver.com/oauth2.0/authorize',
    access_token_url='https://nid.naver.com/oauth2.0/token',
    client_kwargs={
        'scope': 'openid profile email', 
        'token_endpoint_auth_method': 'client_secret_post',
    },
)
