build:
	npx prisma generate ; \
	npm run build ; \
	exit $$1