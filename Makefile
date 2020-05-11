PACKAGE_FILE = price-per-m2.zip
FILES = manifest.json *.js icon*.png

.DEFAULT_GOAL := package

clean:
	rm -f $(PACKAGE_FILE)
	@echo
	@echo "Package file deleted: " $(PACKAGE_FILE)

package:
	zip price-per-m2.zip $(FILES)
	@echo
	@echo "Package file created: " $(PACKAGE_FILE)
