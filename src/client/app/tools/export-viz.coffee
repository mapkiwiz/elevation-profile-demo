# Based on http://bl.ocks.org/Rokotyan/0556f8facbaf344507cdc45dc3622177
# Export SVG D3 visualization to PNG or JPEG

# Below are the functions that handle actual exporting:
# getSVGString ( svgNode ) and svgString2Image( svgString, width, height, format, callback )

import _ from 'lodash';

contains = (str, arr) ->
	
	if arr.indexOf( str ) is -1
		false
	else
		true

extract_css_rules = (parentElement) ->

		# get unique CSS classes
		selectorTextArr = _.uniqBy(parentElement.classList).map (elementClass) ->
			".#{elementClass}"
		
		selectorTextArr.push "##{parentElement.id}"

		# Add Children element Ids and Classes to the list
		for node in parentElement.getElementsByTagName "*"

			if not contains("##{node.id}", selectorTextArr)
				selectorTextArr.push "##{node.id}"

			for elementClass in node.classList
				if not contains(".#{elementClass}", selectorTextArr)
					selectorTextArr.push ".#{elementClass}"

		# Extract CSS Rules
		rules = []
		for sheet in document.styleSheets
			
			try
				if not sheet.cssRules
					continue
			catch error
				if error.name is 'SecurityError'
					throw error
				continue

			for rule in sheet.cssRules
				if contains(rule.selectorText, selectorTextArr)
					rules.push rule

		rules


append_css = (node, rules) ->

	container = document.createElement "style"
	container.setAttribute "type", "text/css"
	container.innerHTML = rules.join("")
	refNode = if node.hasChildNodes() then node.children[0] else null
	node.insertBefore container, refNode
	return


as_text = (svgNode) ->

	svgNode.setAttribute 'xlink', 'http://www.w3.org/1999/xlink'
	css_rules = extract_css_rules svgNode
	append_css svgNode, css_rules
	serializer = new XMLSerializer()
	xml = serializer.serializeToString svgNode
	# Fix root xlink without namespace
	xml = xml.replace /(\w+)?:?xlink=/g, 'xmlns:xlink='
	# Safari NS namespace fix
	xml.replace /NS\d+:href/g, 'xlink:href'


export_as_image =  ( svg, width, height, format, callback ) ->

	xmlstring = as_text svg
	format = if format then format else 'png'
	src = 'data:image/svg+xml;base64,'+ btoa(unescape(encodeURIComponent(xmlstring)))
	canvas = document.createElement "canvas"
	context = canvas.getContext "2d"
	canvas.width = width
	canvas.height = height
	image = new Image()
	image.onload = ->
		context.clearRect 0, 0, width, height
		context.drawImage image, 0, 0, width, height
		canvas.toBlob (blob) ->
			callback blob
	image.src = src
	return

root = exports ? window
root.export_as_image = export_as_image