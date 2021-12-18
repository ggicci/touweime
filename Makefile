default: status

export APP_NAME=web.touwei.me
export IMAGE_NAME=ggicci/touweime-web

SEBA := "./seba.sh"

.PHONY: status
status:
	@$(SEBA) status

.PHONY: build
build:
	@$(SEBA) build

push:
	version=$$( $(SEBA) env SHIP_VERSION ); \
	docker tag $(IMAGE_NAME):$${version} asia.gcr.io/$(IMAGE_NAME):$${version}; \
	docker push asia.gcr.io/$(IMAGE_NAME):$${version}
