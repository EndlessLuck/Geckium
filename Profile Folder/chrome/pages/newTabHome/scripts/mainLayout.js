function setPageWidth() {
	document.documentElement.style.setProperty("--page-width",document.documentElement.clientWidth + "px");
}
addEventListener("resize", setPageWidth);
addEventListener("DOMContentLoaded", setPageWidth);

const { SessionStore } = ChromeUtils.importESModule("resource:///modules/sessionstore/SessionStore.sys.mjs");

function setMostVisitedLayout(layout) {
	const mostVisited = document.getElementById("most-visited");

	const thumbCheckbox = document.getElementById("thumb-checkbox");
	const listCheckbox = document.getElementById("list-checkbox");

	let mostVisitedLayout;

	if (typeof layout !== "undefined" && typeof layout !== "string")
		gkPrefUtils.set("Geckium.newTabHome.mostVisitedLayout").int(layout);

	mostVisitedLayout = gkPrefUtils.tryGet("Geckium.newTabHome.mostVisitedLayout").int;

	if (!mostVisitedLayout)
		mostVisitedLayout = 1;

	switch (layout) {
		case 0:
			mostVisited.classList.add("collapsed");
			mostVisited.classList.remove("list");
			break;

		case 1:
			if (thumbCheckbox.checked) {
				mostVisited.classList.remove("collapsed");
				mostVisited.classList.remove("list");
				listCheckbox.checked = false;
			}
			break;

		case 2:
			if (listCheckbox.checked) {
				mostVisited.classList.remove("collapsed");
				mostVisited.classList.add("list");
				thumbCheckbox.checked = false;
			}
			break;

		case "default":
			if (mostVisitedLayout == 0) {
				mostVisited.classList.add("collapsed");
			} else if (mostVisitedLayout == 1) {
				thumbCheckbox.checked = true;
			} else if (mostVisitedLayout == 2) {
				listCheckbox.checked = true;
				mostVisited.classList.remove("collapsed");
				mostVisited.classList.add("list");
			}
	}
}

function createMainLayout() {
	let appearanceChoice = gkEras.getNTPEra();

	document.querySelectorAll("#recently-closed > .items > .item").forEach((entry) => {
		entry.remove();
	});

	let header = ``;
	let main = ``;
	let footer = ``;

	let editThumbnailsLink;

	let menuBtnsContainer;

	if (appearanceChoice == 1) {
		main = `
		<hbox id="main">
			<vbox flex="1">
				<vbox id="mostvisited">
					<html:div class="section-title">${ntpBundle.GetStringFromName("mostVisited")}</html:div>
					<html:div id="mostvisitedintro">
						<!--<html:div class="most-visited-text">
							The "Most visited" area shows the websites that you use most often. After using Google Chrome for a while, you will see your most visited sites whenever you open a new tab. You can learn more about this and other features on the
							<html:a href="http://tools.google.com/chrome/welcome.html">Getting Started page</html:a>
							.
						</html:div>-->
						<html:div>
							<html:div id="mostvisitedtiles" />
						</html:div>
					</html:div>
				</vbox>
				<html:button class="manage" onclick="Services.wm.getMostRecentBrowserWindow().PlacesCommandHook.showPlacesOrganizer('History')" id="nav">
					<html:span>${ntpBundle.GetStringFromName("showFullHistory")}</html:span>
					»
				</html:button>
			</vbox>
			<vbox id="sidebar">
				<vbox id="logo" />
				<vbox id="searches" class="sidebar">
					<html:div class="section-title">${ntpBundle.GetStringFromName("searches")}</html:div>
					<html:form>
						<html:input type="text" class="hint" name="search" placeholder="${ntpBundle.GetStringFromName("searchYourHistory")}" />
					</html:form>
					<html:div id="search-entries" />
				</vbox>
				<vbox id="recentlyBookmarked" class="sidebar">
					<html:span class="section-title">${ntpBundle.GetStringFromName("recentBookmarks")}</html:span>
					<vbox id="recentlyBookmarkedContainer">

					</vbox>
				</vbox>
				<vbox id="recentlyClosedTabs" class="sidebar">
					<html:div class="section-title">${ntpBundle.GetStringFromName("recentlyClosedTabs")}</html:div>
					<vbox id="recentlyClosedContainer">

					</vbox>
				</vbox>
			</vbox>
		</hbox>
		`
	} else if (appearanceChoice == 2) {
		main = `
		<hbox id="main">
			<vbox flex="1">
				<vbox id="mostvisited">
					<vbox>
						<html:div class="section-title non-edit-visible">${ntpBundle.GetStringFromName("mostVisited")}</html:div>
						<html:div class="section-title edit-visible" style="align-items: center;">
							${ntpBundle.GetStringFromName("clickXToRemoveTheThumbnail")}
						</html:div>
					</vbox>
					<html:div id="mostvisitedintro">
						<!--<html:div class="most-visited-text">
							The "Most visited" area shows the websites that you use most often. After using Google Chrome for a while, you will see your most visited sites whenever you open a new tab. You can learn more about this and other features on the
							<html:a href="http://tools.google.com/chrome/welcome.html">Getting Started page</html:a>
							.
						</html:div>-->
						<html:div>
							<html:div id="mostvisitedtiles" />
						</html:div>
					</html:div>
				</vbox>
				<hbox>
					<html:button class="manage non-edit-visible" id="editthumbnails">
						${ntpBundle.GetStringFromName("removeThumbnails")}
					</html:button>
					<html:button class="edit-visible" id="done">
						${ntpBundle.GetStringFromName("done")}
					</html:button>
					<html:button class="edit-visible" id="cancel">
						${ntpBundle.GetStringFromName("cancel")}
					</html:button>
					<html:button class="manage edit-visible" id="restorethumbnails">
						${ntpBundle.GetStringFromName("restoreAllRemovedThumbnails")}
					</html:button>
					<html:button class="manage non-edit-visible" onclick="Services.wm.getMostRecentBrowserWindow().PlacesCommandHook.showPlacesOrganizer('History')" id="nav">
						<html:span>${ntpBundle.GetStringFromName("showFullHistory")}</html:span>
						»
					</html:button>
				</hbox>
			</vbox>
			<vbox id="sidebar">
				<vbox id="logo" />
				<vbox id="searches" class="sidebar">
					<html:div class="section-title">${ntpBundle.GetStringFromName("searches")}</html:div>
					<html:form>
						<html:input type="text" class="hint" name="search" placeholder="${ntpBundle.GetStringFromName("searchYourHistory")}" />
					</html:form>
					<html:div id="search-entries" />
				</vbox>
				<vbox id="recentlyBookmarked" class="sidebar">
					<html:span class="section-title">${ntpBundle.GetStringFromName("recentBookmarks")}</html:span>
					<vbox id="recentlyBookmarkedContainer" />
				</vbox>
				<vbox id="recentlyClosedTabs" class="sidebar">
					<html:div class="section-title">${ntpBundle.GetStringFromName("recentlyClosedTabs")}</html:div>
					<vbox id="recentlyClosedContainer" />
				</vbox>
			</vbox>
		</hbox>
		`
		
		waitForElm("#main").then(() => {
			const mainElm = document.getElementById("main");

			document.querySelector(".manage#editthumbnails").addEventListener("click", () => {
				mainElm.classList.add("edit-mode");
			});

			document.querySelector(".edit-visible#done").addEventListener("click", () => {
				deleteStoredFromDeletionSites();

				setTimeout(() => {
					retrievePinnedSites();
					retrieveFrequentSites();
				},20);

				mainElm.classList.remove("edit-mode");
			});

			document.querySelector(".edit-visible#cancel").addEventListener("click", () => {
				document.querySelectorAll(".most-visited-container").forEach(thumbnail => {
					if (getComputedStyle(thumbnail).display === 'none')
						thumbnail.style.display = '';
				})

				storedForDeletion = [];

				mainElm.classList.remove("edit-mode");
			});

			document.querySelector(".edit-visible#restorethumbnails").addEventListener("click", () => {
				document.querySelectorAll(".most-visited-container").forEach(thumbnail => {
					if (getComputedStyle(thumbnail).display === 'none')
						thumbnail.style.display = '';
				})

				storedForDeletion = [];
			});
		});
	} else if (appearanceChoice <= 6) {
		menuBtnsContainer = "#view-toolbar";

		if (appearanceChoice == 3) {
			// Chrome 0 - 5	
			main = `
			<vbox id="main">
				<hbox id="view-toolbar">
					<html:input type="checkbox" id="thumb-checkbox" title="${ntpBundle.GetStringFromName("thumbnailView")}"></html:input>
					<html:input type="checkbox" id="list-checkbox" title="${ntpBundle.GetStringFromName("listView")}"></html:input>
					<html:button id="option-button" type="menu" class="window-menu-button" title="${ntpBundle.GetStringFromName("changePageLayout")}">
						<vbox id="option-menu" class="window-menu">
							<checkbox id="THUMB" label="${ntpBundle.GetStringFromName("mostVisited")}"></checkbox>
							<checkbox id="RECENT" label="${ntpBundle.GetStringFromName("recentlyClosed")}"></checkbox>
						</vbox>
					</html:button>
				</hbox>
				<div id="most-visited"></div>
				<hbox id="lower-sections">
					<vbox id="recent-activities" class="section">
						<h2>${ntpBundle.GetStringFromName("recentActivities")}</h2>
						<hbox>
							<vbox id="recent-tabs">
								<vbox class="item-container">
									<vbox id="tab-items" />
									<vbox>
										<html:button class="item nav" onclick="Services.wm.getMostRecentBrowserWindow().PlacesCommandHook.showPlacesOrganizer('History')" id="nav">${ntpBundle.GetStringFromName("viewFullHistory")}</html:button>
									</vbox>
								</vbox>
								<vbox class="item-container">
									<vbox id="download-items" />
									<vbox>
										<html:a href="about:downloads" class="item nav">${ntpBundle.GetStringFromName("viewAllDownloads")}</html:a>
									</vbox>
								</vbox>
							</vbox>
						</hbox>
					</vbox>
					<vbox id="tips" class="section">
						<h2>${ntpBundle.GetStringFromName("evenMore")}</h2>
						<hbox>
							<vbox id="tip-items">
								<div class="tips-title item">${ntpBundle.GetStringFromName("whatWillWePutHere")}</div>
								<vbox class="tips-container item-container"/>
							</vbox>
						</hbox>
					</vbox>
				</hbox>
			</vbox>
			`;
		} else if (appearanceChoice <= 4) {
			// Chrome 0 - 5	
			main = `
			<vbox id="main">
				<hbox id="view-toolbar">
					<html:input type="checkbox" id="thumb-checkbox" title="${ntpBundle.GetStringFromName("thumbnailView")}"></html:input>
					<html:input type="checkbox" id="list-checkbox" title="${ntpBundle.GetStringFromName("listView")}"></html:input>
					<html:button id="option-button" type="menu" class="window-menu-button" title="${ntpBundle.GetStringFromName("changePageLayout")}">
						<vbox id="option-menu" class="window-menu">
							<checkbox id="THUMB" label="${ntpBundle.GetStringFromName("mostVisited")}"></checkbox>
							<checkbox id="RECENT" label="${ntpBundle.GetStringFromName("recentlyClosed")}"></checkbox>
						</vbox>
					</html:button>
				</hbox>
				<div id="most-visited"></div>
				<hbox id="recently-closed">
					<label value="${ntpBundle.GetStringFromName("recentlyClosed")}"></label>
					<hbox class="items"></hbox>
					<button class="item" onclick="Services.wm.getMostRecentBrowserWindow().PlacesCommandHook.showPlacesOrganizer('History')" id="nav" label="${ntpBundle.GetStringFromName("viewFullHistory")}"></button>
				</hbox>
				<vbox id="attribution">
					<label>${ntpBundle.GetStringFromName("themeCreatedBy")}</label>
					<html:div id="attribution-img"></html:div>
				</vbox>
			</vbox>
			`;
	
			footer = `
			<vbox id="footer">
				<html:a id="extensions-link" href="https://chrome.google.com/extensions">
					<html:img id="promo-image" src="chrome://userchrome/content/pages/newTabHome/assets/chrome-4/newtab_themes_promo.png"></html:img>
				</html:a>
			</vbox>
			`;
		} else if (appearanceChoice <= 5) {
			// Chrome 0 - 5	
			main = `
			<vbox id="main">
				<hbox id="view-toolbar">
					<html:input type="checkbox" id="thumb-checkbox" title="${ntpBundle.GetStringFromName("thumbnailView")}"></html:input>
					<html:input type="checkbox" id="list-checkbox" title="${ntpBundle.GetStringFromName("listView")}"></html:input>
					<html:button id="option-button" type="menu" class="window-menu-button" title="${ntpBundle.GetStringFromName("changePageLayout")}">
						<vbox id="option-menu" class="window-menu">
							<checkbox id="THUMB" label="${ntpBundle.GetStringFromName("mostVisited")}"></checkbox>
							<checkbox id="RECENT" label="${ntpBundle.GetStringFromName("recentlyClosed")}"></checkbox>
							<checkbox id="TIPS" label="${ntpBundle.GetStringFromName("tips")}"></checkbox>
						</vbox>
					</html:button>
				</hbox>
				<div id="most-visited"></div>
				<hbox id="recently-closed">
					<label value="${ntpBundle.GetStringFromName("recentlyClosed")}"></label>
					<hbox class="items"></hbox>
					<button class="item" onclick="Services.wm.getMostRecentBrowserWindow().PlacesCommandHook.showPlacesOrganizer('History')" id="nav" label="${ntpBundle.GetStringFromName("viewFullHistory")}"></button>
				</hbox>
				<vbox id="attribution">
					<label>${ntpBundle.GetStringFromName("themeCreatedBy")}</label>
					<html:div id="attribution-img"></html:div>
				</vbox>
			</vbox>
			`;
	
			footer = `
			<vbox id="footer">
				<html:a id="extensions-link" href="https://chrome.google.com/extensions">
					<html:img id="promo-image" src="chrome://userchrome/content/pages/newTabHome/assets/chrome-5/newtab_extensions_promo.png"></html:img>
				</html:a>
			</vbox>
			`;
		} else if (appearanceChoice <= 6) {
			// Chrome 0 - 5
			main = `
			<vbox id="main">
				<hbox id="view-toolbar">
					<html:button id="option-button" type="menu" class="window-menu-button" title="${ntpBundle.GetStringFromName("changePageLayout")}">
						<vbox id="option-menu" class="window-menu">
							<checkbox id="THUMB" label="${ntpBundle.GetStringFromName("mostVisited")}"></checkbox>
							<checkbox id="RECENT" label="${ntpBundle.GetStringFromName("recentlyClosed")}"></checkbox>
							<checkbox id="TIPS" label="${ntpBundle.GetStringFromName("tips")}"></checkbox>
						</vbox>
					</html:button>
				</hbox>
				<vbox class="sections">
					<vbox id="most-visited-section" class="section">
						<h2>${ntpBundle.GetStringFromName("mostVisited")}</h2>
						<html:div id="most-visited" />
					</vbox>
				</vbox>
				
				<hbox id="recently-closed" class="section">
					<html:h2>${ntpBundle.GetStringFromName("recentlyClosed")}</html:h2>
					<hbox class="items"></hbox>
					<button class="item" onclick="Services.wm.getMostRecentBrowserWindow().PlacesCommandHook.showPlacesOrganizer('History')" id="nav" label="${ntpBundle.GetStringFromName("viewFullHistory")}"></button>
				</hbox>
				<vbox id="attribution">
					<label>${ntpBundle.GetStringFromName("themeCreatedBy")}</label>
					<html:div id="attribution-img"></html:div>
				</vbox>
			</vbox>
			`;
	
			footer = `
			<vbox id="footer">
				<html:a id="extensions-link" href="https://chrome.google.com/extensions">
					<html:img id="promo-image" src="chrome://userchrome/content/pages/newTabHome/assets/chrome-5/newtab_extensions_promo.png"></html:img>
				</html:a>
			</vbox>
			`;
		}

		waitForElm(menuBtnsContainer).then(() => {
			const thumbCheckbox = document.getElementById("thumb-checkbox");
			const listCheckbox = document.getElementById("list-checkbox");

			thumbCheckbox.addEventListener("change", () => {
				if (thumbCheckbox.checked == true)
					setMostVisitedLayout(1);
				else if (!thumbCheckbox.checked && !listCheckbox.checked)
					setMostVisitedLayout(0); // Update layout to 0 when both checkboxes are unchecked
			});

			listCheckbox.addEventListener("change", () => {
				if (listCheckbox.checked == true)
					setMostVisitedLayout(2);
				else if (!thumbCheckbox.checked && !listCheckbox.checked)
					setMostVisitedLayout(0); // Update layout to 0 when both checkboxes are unchecked
			});
		});
	} else if (appearanceChoice == 11) {
		// Chrome 11

		main = `
		<vbox id="main">
			<vbox class="sections">
				<vbox id="apps">
					<hbox class="section collapsed">
						<html:button class="disclosure" />
						<label>${ntpBundle.GetStringFromName("apps")}</label>
						<spacer></spacer>
						<button class="section-close-button"></button>
					</hbox>
					<html:div id="apps-content" />
				</vbox>
				<vbox id="most-viewed">
					<hbox class="section">
						<html:button class="disclosure" />
						<label>${ntpBundle.GetStringFromName("mostVisited")}</label>
						<spacer></spacer>
						<button class="section-close-button"></button>
					</hbox>
					<html:div id="most-viewed-content"></html:div>
				</vbox>
				<vbox id="recently-closed">
					<hbox class="section collapsed">
						<html:button class="disclosure" style="pointer-events: none; opacity: 0;" />
						<label>${ntpBundle.GetStringFromName("recentlyClosed")}</label>
						<spacer></spacer>
						<button class="section-close-button"></button>
					</hbox>
					<html:div id="recently-closed-content"></html:div>
				</vbox>
			</vbox>
		</vbox>
		`;

		footer = `
		<vbox id="attribution">
			<label>${ntpBundle.GetStringFromName("themeCreatedBy")}</label>
			<html:div id="attribution-img"></html:div>
		</vbox>
		<vbox id="footer">
			<hbox id="logo-img">
				<html:div id="logo-icon"></html:div>
				<html:div id="logo-wordmark"></html:div>
			</hbox>
		</vbox>
		`;

		waitForElm("#main > .sections").then(() => {
			const ntpAppsCollapsedObs = {
				observe: function (subject, topic, data) {
					if (topic == "nsPref:changed") {
						if (gkPrefUtils.tryGet("Geckium.newTabHome.appsCollapsed").bool) {
							appsSectionElm.classList.add("collapsed");
							gkPrefUtils.set("Geckium.newTabHome.mostViewedCollapsed").bool(false);
						} else {
							appsSectionElm.classList.remove("collapsed");
							gkPrefUtils.set("Geckium.newTabHome.mostViewedCollapsed").bool(true);
						}	
					}
				},
			};
			Services.prefs.addObserver("Geckium.newTabHome.appsCollapsed", ntpAppsCollapsedObs, false);

			const appsSectionElm = document.querySelector("#apps > .section");

			if (gkPrefUtils.tryGet("Geckium.newTabHome.appsCollapsed").bool)
				appsSectionElm.classList.add("collapsed");
			else
				appsSectionElm.classList.remove("collapsed");

			appsSectionElm.addEventListener("click", () => {
				gkPrefUtils.toggle("Geckium.newTabHome.appsCollapsed");
			});


			const ntpMostViewedCollapsedObs = {
				observe: function (subject, topic, data) {
					if (topic == "nsPref:changed") {
						if (gkPrefUtils.tryGet("Geckium.newTabHome.mostViewedCollapsed").bool) {
							mostViewedSectionElm.classList.add("collapsed");
							gkPrefUtils.set("Geckium.newTabHome.appsCollapsed").bool(false);
						} else {
							mostViewedSectionElm.classList.remove("collapsed");
							gkPrefUtils.set("Geckium.newTabHome.appsCollapsed").bool(true);
						}
					}
				},
			};
			Services.prefs.addObserver("Geckium.newTabHome.mostViewedCollapsed", ntpMostViewedCollapsedObs, false);

			const mostViewedSectionElm = document.querySelector("#most-viewed > .section");

			if (gkPrefUtils.tryGet("Geckium.newTabHome.mostViewedCollapsed").bool)
				mostViewedSectionElm.classList.add("collapsed");
			else
				mostViewedSectionElm.classList.remove("collapsed");

			mostViewedSectionElm.addEventListener("click", () => {
				gkPrefUtils.toggle("Geckium.newTabHome.mostViewedCollapsed");
			});
		});
	} else if (appearanceChoice == 21 || appearanceChoice == 25) {
		// Chrome 21 - 45

		menuBtnsContainer = "#footer-menu-container";

		header = `
		<html:a href="https://accounts.firefox.com/?service=sync" id="login-container">
			<html:div id="login-status-header-container" class="login-status-row">
				<html:div id="login-status-header">${ntpBundle.GetStringFromName("notSignedInTo").replace("%s", gkBranding.getBrandingKey("productName"))}</html:div>
			</html:div>
			<html:div id="login-status-sub-header">${ntpBundle.GetStringFromName("youAreMissingOut")}</html:div>
		</html:a>
		<html:div id="login-email" />
		`;

		main = `
		<hbox id="card-slider-frame">
			<button id="page-switcher-start" class="page-switcher" label="‹" disabled="true"></button>
			<hbox id="page-list">
				<vbox class="tile-page selected" id="most-visited-page" data-page="0">
					<vbox class="tile-page-content">
						<html:div class="tile-grid" />
					</vbox>
				</vbox>
				<vbox class="tile-page" id="apps-page" data-page="1">
					<vbox class="tile-page-content">
						<html:div class="tile-grid" />
					</vbox>
				</vbox>
			</hbox>
			<button id="page-switcher-end" class="page-switcher" label="›"></button>
			<vbox id="attribution">
				<label>${ntpBundle.GetStringFromName("themeCreatedBy")}</label>
				<html:div id="attribution-img" />
			</vbox>
		</hbox>
		`;

		footer = `
		<vbox id="footer">
			<html:div id="footer-border" />
			<hbox id="footer-content">
				<hbox id="logo-img">
					<html:div id="logo-icon" />
					<html:div id="logo-wordmark" />
				</hbox>
				<hbox id="dot-list">
					<button onclick="switchTab('', false, 0)" class="dot selected" label="${ntpBundle.GetStringFromName("mostVisited")}" data-page="0">
						<html:div class="selection-bar" />
					</button>
					<button onclick="switchTab('', false, 1)" class="dot" label="${ntpBundle.GetStringFromName("apps")}" data-page="1">
						<html:div class="selection-bar" />
					</button>
				</hbox>
				<hbox id="footer-menu-container">
					<html:button id="other-sessions-menu-button" class="footer-menu-button" type="menu">
						<label>${ntpBundle.GetStringFromName("otherDevices")}</label>
					</html:button>
					<html:button id="recently-closed-menu-button" class="footer-menu-button" type="menu">
						<label>${ntpBundle.GetStringFromName("recentlyClosed")}</label>
						<vbox class="footer-menu" />
					</html:button>
					<html:div id="vertical-separator" />
				</hbox>
				
				<html:a id="chrome-web-store-link" href="https://chrome.google.com/webstore">
					<label>Web Store</label>
				</html:a>
			</hbox>
		</vbox>
		`;
	} else if (appearanceChoice >= 47) {
		// Chrome 47 - 50
		if (appearanceChoice == 47 && gkPrefUtils.tryGet("Geckium.chrflag.enable.icon.ntp").bool) {
			header = `
			<vbox id="google-search">
				<html:img id="hplogo" width="272px" height="92px" alt="Google" src="chrome://userchrome/content/pages/newTabHome/assets/chrome-47/imgs/googlelogo_color_272x92dp.png" title="Google"></html:img>
				<html:form>
					<html:input id="google-input" placeholder="${ntpBundle.GetStringFromName("searchGoogleOrTypeURL")}"></html:input>
				</html:form>
			</vbox>
			`;
		} else {
			header = `
			<hbox id="google-bar">
				<html:a href="https://mail.google.com/mail">${ntpBundle.GetStringFromName("gmailProduct")}</html:a>
				<html:a href="https://www.google.com/imghp">${ntpBundle.GetStringFromName("googleImages")}</html:a>
				<html:a id="google-products-link" href="https://about.google/products/#all-products" title="${ntpBundle.GetStringFromName("apps")}" />
				<html:div id="products-grid-pane-container">
					<html:div id="products-grid-arrow-border" />
					<html:div id="products-grid-arrow-background" />

					<vbox id="products-grid-container" class="hide-scrollbar">
						<html:ul class="products-grid">
							<html:li class="product-container">
								<html:a class="product">
									<html:span class="product-icon" />
									<html:span class="product-name">${ntpBundle.GetStringFromName("searchProduct")}</html:span>
								</html:a>
							</html:li>
							<html:li class="product-container">
								<html:a class="product">
									<html:span class="product-icon" />
									<html:span class="product-name">${ntpBundle.GetStringFromName("youTubeProduct")}</html:span>
								</html:a>
							</html:li>
							<html:li class="product-container">
								<html:a class="product">
									<html:span class="product-icon" />
									<html:span class="product-name">${ntpBundle.GetStringFromName("mapsProduct")}</html:span>
								</html:a>
							</html:li>
							<html:li class="product-container">
								<html:a class="product">
									<html:span class="product-icon" />
									<html:span class="product-name">${ntpBundle.GetStringFromName("playProduct")}</html:span>
								</html:a>
							</html:li>
							<html:li class="product-container">
								<html:a class="product">
									<html:span class="product-icon" />
									<html:span class="product-name">${ntpBundle.GetStringFromName("newsProduct")}</html:span>
								</html:a>
							</html:li>
							<html:li class="product-container">
								<html:a class="product">
									<html:span class="product-icon" />
									<html:span class="product-name">${ntpBundle.GetStringFromName("gmailProduct")}</html:span>
								</html:a>
							</html:li>
							<html:li class="product-container">
								<html:a class="product">
									<html:span class="product-icon" />
									<html:span class="product-name">${ntpBundle.GetStringFromName("driveProduct")}</html:span>
								</html:a>
							</html:li>
							<html:li class="product-container">
								<html:a class="product">
									<html:span class="product-icon" />
									<html:span class="product-name">${ntpBundle.GetStringFromName("calendarProduct")}</html:span>
								</html:a>
							</html:li>
							<html:li class="product-container">
								<html:a class="product">
									<html:span class="product-icon" />
									<html:span class="product-name">${ntpBundle.GetStringFromName("translateProduct")}</html:span>
								</html:a>
							</html:li>
						</html:ul>
						<html:a id="more-products-button">${ntpBundle.GetStringFromName("more")}</html:a>
						<html:span class="divider" />
						<html:ul id="more-products-grid" class="products-grid">
							<html:li class="product-container">
								<html:a class="product">
									<html:span class="product-icon" />
									<html:span class="product-name">${ntpBundle.GetStringFromName("booksProduct")}</html:span>
								</html:a>
							</html:li>
							<html:li class="product-container">
								<html:a class="product">
									<html:span class="product-icon" />
									<html:span class="product-name">${ntpBundle.GetStringFromName("walletProduct")}</html:span>
								</html:a>
							</html:li>
							<html:li class="product-container">
								<html:a class="product">
									<html:span class="product-icon" />
									<html:span class="product-name">${ntpBundle.GetStringFromName("shoppingProduct")}</html:span>
								</html:a>
							</html:li>
							<html:li class="product-container">
								<html:a class="product">
									<html:span class="product-icon" />
									<html:span class="product-name">${ntpBundle.GetStringFromName("bloggerProduct")}</html:span>
								</html:a>
							</html:li>
							<html:li class="product-container">
								<html:a class="product">
									<html:span class="product-icon" />
									<html:span class="product-name">${ntpBundle.GetStringFromName("financeProduct")}</html:span>
								</html:a>
							</html:li>
							<html:li class="product-container">
								<html:a class="product">
									<html:span class="product-icon" />
									<html:span class="product-name">${ntpBundle.GetStringFromName("photosProduct")}</html:span>
								</html:a>
							</html:li>
						</html:ul>
						<html:a id="even-more" href="http://www.google.com/intl/en/options/">${ntpBundle.GetStringFromName("evenMoreFromGoogle")}</html:a>
					</vbox>
				</html:div>
				
			</hbox>
			<vbox id="google-search">
				<html:div id="hplogo" title="Google" />
				<html:form>
					<html:input id="google-input" placeholder="${ntpBundle.GetStringFromName("searchGoogleOrTypeURL")}"></html:input>
				</html:form>
			</vbox>
			`;

			waitForElm("#google-products-link").then(() => {
				const googleAppsLink = document.getElementById("google-products-link");
				googleAppsLink.addEventListener("click", (e) => {
					e.preventDefault();

					if (!googleAppsLink.hasAttribute("open"))
						googleAppsLink.setAttribute("open", true);
					else
						googleAppsLink.removeAttribute("open");

					// Stop the event from propagating further to prevent triggering the document click listener
					e.stopPropagation();
				});

				const appsGridContainer = document.getElementById("products-grid-container");
				// Add event listener to the document to listen for clicks outside of the button
				document.addEventListener("click", function (event) {
					// Check if the clicked element is the button or one of its children
					const isClickedInsideButton = googleAppsLink.contains(event.target);
					const isClickedInsideAppGrid = appsGridContainer.contains(event.target);

					// If the click is not inside the button or its children, remove the "open" attribute
					if (!isClickedInsideButton && !isClickedInsideAppGrid)
						googleAppsLink.removeAttribute("open");
				});

				const moreAppsButton = document.getElementById("more-products-button");
				moreAppsButton.addEventListener("click", () => {
					appsGridContainer.scroll(0, 1);
					
					setTimeout(() => {
						appsGridContainer.scroll({
							top: 257,
							left: 0,
							behavior: "smooth",
						});
					}, 0);
				});
				
				appsGridContainer.addEventListener("scroll", () => {
					if (appsGridContainer.scrollTop == 0)
						appsGridContainer.classList.add("hide-scrollbar");
					else
						appsGridContainer.classList.remove("hide-scrollbar");
				});
			});
		}

		main = `
		<html:div id="mv-tiles" />
		<vbox id="attribution">
			<label>${ntpBundle.GetStringFromName("themeCreatedBy")}</label>
			<html:div id="attribution-img" />
		</vbox>
		`;

		waitForElm("#google-search").then(() => {
			const form = document.querySelector("#google-search > form");
			form.addEventListener("submit", (event) => {
				event.preventDefault();
				location.href = "https://www.google.com/search?q=" + form.querySelector("input").value;
			});
		});
	}

	// Create contents
	const container = document.querySelector("#main-container");

	Array.from(container.childNodes).forEach((elm) => {
		elm.remove();
	});

	container.appendChild(MozXULElement.parseXULToFragment(header));
	container.appendChild(MozXULElement.parseXULToFragment(main));
	container.appendChild(MozXULElement.parseXULToFragment(footer));

	waitForElm("#most-visited").then(() => {
		setMostVisitedLayout("default");
	});

	if (appearanceChoice <= 6 || appearanceChoice == 21 || appearanceChoice == 25) {
		waitForElm(menuBtnsContainer).then(() => {
			document.querySelectorAll('[type="menu"]').forEach((menuBtn) => {
				menuBtn.addEventListener("click", function (event) {
					if (!menuBtn.hasAttribute("open"))
						menuBtn.setAttribute("open", true);
					else
						menuBtn.removeAttribute("open"); // Add the "open" attribute to the button

					// Stop the event from propagating further to prevent triggering the document click listener
					event.stopPropagation();
				});

				// Add event listener to the document to listen for clicks outside of the button
				document.addEventListener("click", function (event) {
					// Check if the clicked element is the button or one of its children
					const isClickedInsideButton = menuBtn.contains(event.target);

					// If the click is not inside the button or its children, remove the "open" attribute
					if (!isClickedInsideButton)
						menuBtn.removeAttribute("open");
				});
			});
		});
	}
	if (appearanceChoice == 21 || appearanceChoice == 25) {
		//Trigger sign in status-update
		updateSignInStatus();
	}
}

function setPinInEveryEra() {
	document.documentElement.setAttribute("pinineveryera", gkPrefUtils.tryGet("Geckium.newTabHome.pinInEveryEra").bool);
}

addEventListener("load", setPinInEveryEra);
const ntpPinInEveryEraObs = {
	observe: function (subject, topic, data) {
		if (topic == "nsPref:changed") {
			setPinInEveryEra();
		}
	},
};
Services.prefs.addObserver("Geckium.newTabHome.pinInEveryEra", ntpPinInEveryEraObs, false);