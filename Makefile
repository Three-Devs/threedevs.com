build:
	set -e
	npm i
	node_modules/.bin/hugo -h
	npx hugo-cli version
	npm run build --colors

deploy: build
	aws s3 sync site/ s3://threedevs.com --acl public-read --delete
	aws configure set preview.cloudfront true
	aws cloudfront create-invalidation --distribution-id E38CJL5UNTKJ2F --paths '/*'
