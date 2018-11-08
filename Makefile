build:
	set -e
	npm i
	npm run build --colors
	wget https://github.com/gohugoio/hugo/releases/download/v0.51/hugo_0.51_Linux-64bit.tar.gz
	tar -xvzf hugo_0.51_Linux-64bit.tar.gz hugo
	./hugo version
	./hugo -d site --gc --cleanDestinationDir

deploy: build
	aws s3 sync site/ s3://threedevs.com --acl public-read --delete
	aws configure set preview.cloudfront true
	aws cloudfront create-invalidation --distribution-id E38CJL5UNTKJ2F --paths '/*'
