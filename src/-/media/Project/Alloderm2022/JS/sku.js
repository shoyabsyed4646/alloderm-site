//convert the raw json from excel sheet data to the desired json format
$(document).ready(function () {

    //initiate the selection
    $('.get-started').on('click', function () {
        $('.step0-wrapper').hide();
        $('.sku-box, .sku-ordering-tool .header-section, .sku-ordering-tool .step-1').show();
    })
    let finalProductsDataArray = [];
    //ui path = "SKU_Data_04172023.json"
    //sc path = "/-/media/Project/Alloderm2022/Json/sku.json"
    $.getJSON("/-/media/Project/Alloderm2022/Json/sku.json", function (result) {
        let rectangleArr = [];
        let rectangleFinal = {};
        const applications = _.groupBy(result.Sheet1, (obj) =>
            obj.Application.trim()
        );
        const shapes = _.groupBy(applications.Implantable, (obj) =>
            obj.Shape.trim()
        );

        const implantable = _.mapValues(shapes, (thick) =>
            _.groupBy(thick, (obj) => {
                if (obj.Shape.trim() === "Rectangle") {
                    rectangleArr.push(obj);
                } else {
                    return obj.ProductSize.trim();
                }
            })
        );
        implantable.Rectangle = rectangleArr;

        Object.keys(implantable).forEach((v) => {
            if (v === "Rectangle") {
                rectangleFinal = _.groupBy(implantable[v], (obj) => obj.Texture.trim());
                rectangleFinal = _.mapValues(rectangleFinal, (thick) =>
                    _.groupBy(thick, (obj) => obj.Width.trim())
                );
                Object.keys(rectangleFinal).forEach((v) => {
                    rectangleFinal[v] = _.mapValues(rectangleFinal[v], (thick) =>
                        _.groupBy(thick, (obj) => obj.Length.trim())
                    );
                });
            } else {
                implantable[v] = _.mapValues(implantable[v], (thick) =>
                    _.groupBy(thick, (obj) => obj.Texture.trim())
                );
            }
        });

        // Graft

        var FinalGraftableData = [];
        var NonperforatedObj = {};
        let graftable = _.groupBy(applications.Graftable, (text) => {
            return text.Texture.trim();
        });

        Object.keys(graftable).forEach((d) => {
            if (d === "Nonperforated") {
                NonperforatedObj = _.groupBy(graftable[d], (obj) =>
                    obj.ProductSize.trim()
                );
                NonperforatedObj = _.mapValues(NonperforatedObj, (thick) =>
                    _.groupBy(thick, (obj) => obj.Width.trim())
                );

                // Object.keys(NonperforatedObj).forEach((v) => {
                //   NonperforatedObj[v] = _.mapValues(NonperforatedObj[v], (thick) =>
                //     _.groupBy(thick, (obj) => obj.Length.trim())
                //   );
                // });

                FinalGraftableData[d] = NonperforatedObj;
            } else {
                // FinalGraftableData[d] = _.groupBy(graftable[d], (obj) =>
                //   obj.ProductSize.trim()
                // );
                FinalGraftableData[d] = graftable[d];
            }
        });

        finalProductsDataArray.push({
            Implantable: implantable,
            Graftable: { ...FinalGraftableData },
        });
        finalProductsDataArray[0].Implantable.Rectangle = rectangleFinal;
        console.log(finalProductsDataArray[0]);
    });

    //set the local storage variable to remember the type of application user clicked
    // either implantable or graftable
    //on page load set the value to empty
    localStorage.setItem("selectedApplication", "");
    localStorage.setItem("selectedThickness", "");
    localStorage.setItem("selectedTexture", "");
    localStorage.setItem("selectedShape", "");
    localStorage.setItem("currentStep", 1);

    //Handle Button Clicks on step-1
    $(".buttons-view-container .row .col button").each(function () {
        $(this).click(getButtonData);
    });

    function getButtonData() {
        if ($(this).text().trim() == "Implantable") {
            localStorage.setItem("selectedApplication", $(this).text());
            $("#step1").hide();
            $("#step2").show();
            localStorage.setItem("currentStep", 2);
            $("#step2").addClass("implantable-step2");
            showImplantData();
            createBreadCrumb({ name: $(this).text().trim(), step: 1 });
        } else if ($(this).text().trim() == "Graftable") {
            localStorage.setItem("selectedApplication", $(this).text());
            $("#step1").hide();
            $("#step2").show();
            localStorage.setItem("currentStep", 2);
            $("#step2").removeClass("implantable-step2");
            $("#step2").addClass("graftable-step2");
            showGraftData();
            createBreadCrumb({ name: $(this).text().trim(), step: 1 });
        }
    }

    function showImplantData() {
        createButtons(finalProductsDataArray[0].Implantable);
    }

    function showGraftData() {
        createButtons(finalProductsDataArray[0].Graftable);
    }

    function createButtons(SpecificSelectedObject) {
        for (let i = 0; i < Object.keys(SpecificSelectedObject).length; i++) {
            createButtonHtml(
                Object.keys(SpecificSelectedObject)[i],
                SpecificSelectedObject[Object.keys(SpecificSelectedObject)[i]]
            );
        }
    }
    function createButtonHtml(data, completeObject) {
        var btncontainer = "";
        let currentStep = parseInt(localStorage.getItem("currentStep"));
        let app = localStorage.getItem("selectedApplication");
        switch (currentStep) {
            case 2:
                btncontainer = $("#step2 .buttons-view-container .row");
                break;
            case 3:
                $("#step2").hide();
                $("#step3").show();
                btncontainer = $("#step3 .buttons-view-container .row");
                break;
            case 4:
                $("#step3").hide();
                $("#step4").show();
                btncontainer = $("#step4 .buttons-view-container .row");
                break;
        }
        let btnHtml = "";


        if (data == "Small" || data == "Medium" || data == "Large" || data == "X-Large") {
            btnHtml += `
        <div class="col">
            <button type="button" class="btn" id="${data}-btn"
                data-breadCrumbText="${data}" onclick="(showStep3Buttons('${data}', '${completeObject}'))">${data}<br><span>${completeObject.Nonperforated[0].Width} x ${completeObject.Nonperforated[0].Length} cm</span></button>
        </div>
        
        `;
        }
        else if (data == "X-Thin") {
            btnHtml += `
        <div class="col">
            <button type="button" class="btn" id="${data}-btn"
                data-breadCrumbText="${data}" onclick="(showStep3Buttons('${data}', '${completeObject}'))">${data}<br><span>(${completeObject[1][0]["Thickness Range"]})</span></button>
        </div>
        
        `;
        }
        else if (data == "Thin") {
            btnHtml += `
        <div class="col">
            <button type="button" class="btn" id="${data}-btn"
                data-breadCrumbText="${data}" onclick="(showStep3Buttons('${data}', '${completeObject}'))">${data}<br><span>(${completeObject[1][1]["Thickness Range"]})</span></button>
        </div>
        
        `;
        }
        else {
            btnHtml += `
    <div class="col">
        <button type="button" class="btn" id="${data}-btn"
            data-breadCrumbText="${data}" onclick="(showStep3Buttons('${data}', '${completeObject}'))">${data}</button>
    </div>
    
    `;
        }

        btncontainer.append(btnHtml);
        //addClassestoParent(btncontainer);
        appendImages(currentStep, app);
    }

    function createWidthDropDown(data) {
        $("#step3").hide();
        $("#step4").show();
        let btncontainer = "";
        btncontainer = $("#step4 .buttons-view-container .row");
        //btncontainer.empty();
        $("#step4 .step-number").text("4");
        $("#step4 .screen-heading").hide()
        let selectOptions = "";
        selectOptions += `<div class="prod-width">`;
        selectOptions += `
    <select class="form-select selectpicker" id="widthSelect" onchange="selectedOption('Width')" aria-label="Default select example">
    
    <option value="default" selected>Select your Width (shorter side)</option>
    `;
        var keys = Object.keys(data);
        for (let i in keys) {
            selectOptions += `
       <option value="${keys[i]}">${keys[i]}</option>
      `;
        }
        selectOptions += `</select>`;
        selectOptions += `</div>`;
        setTimeout(function () {
            $('#widthSelect').selectpicker({
                'size': 7,
                'dropupAuto': false
            });
        }, 0.001);
        if ($("#widthSelect").length == 0) {
            btncontainer.append(selectOptions);
            //$('.selectpicker').selectpicker();
            $("#rect-width-img").clone().insertBefore($('#widthSelect'));
            $("#rectangle-right-text").clone().insertAfter($('#widthSelect'));
            if ($("#step4 .buttons-view-container #rectangle-bottom-text").length == 0) {
                $('#rectangle-bottom-text').clone().insertAfter(btncontainer);
            }
        }

    }
    function createGraftableWidthDropDown(data) {
        $("#step3").hide();
        $("#step4").show();
        let btncontainer = "";
        btncontainer = $("#step4 .buttons-view-container .row");
        $("#step4 .screen-heading").hide();
        let selectOptions = "";
        selectOptions += `<div class="prod-width">`;
        selectOptions += `
    <select class="form-select" id="widthGraftableSelect" onchange="GraftableSelectedOption('Width')" aria-label="Default select example">
      <option value="default" selected>Select your Length (longer side)</option>
    `;
        var keys = Object.keys(data);
        for (let i in keys) {
            selectOptions += `
       <option value="${keys[i]}">${keys[i]}</option>
      `;
        }
        `</select>`;
        selectOptions += `</div>`;
        setTimeout(function () {
            $('#widthGraftableSelect').selectpicker({
                'size': 7,
                'dropupAuto': false
            });
        }, 0.01);
        if ($("#widthGraftableSelect").length == 0) {
            btncontainer.append(selectOptions);
            $(".prod-width").show();
            $("#graft-width-img").clone().insertBefore($('#widthGraftableSelect'));
            $("#rectangle-right-text").clone().insertAfter($('#widthGraftableSelect'));
            if ($("#step4 .buttons-view-container #graft-bottom-text").length == 0) {
                $('#graft-bottom-text').clone().insertAfter(btncontainer);
                $('#rectangle-bottom-text').hide();
            }
        }
    }

    function createLengthDropDown(data) {
        $("#step3").hide();
        $("#step4").show();
        let btncontainer = "";
        btncontainer = $("#step4 .buttons-view-container .row");
        //btncontainer.empty();
        $("#step4 .step-number").text("5");
        let selectOptions = "";
        selectOptions += `<div class="prod-length">`;
        selectOptions += `
    <select class="form-select" id="LengthSelect" onchange="selectedOption('Length')" aria-label="Default select example">
      <option value="default" selected>Select your Length (longer side)</option>
    `;
        var keys = Object.keys(data);
        for (let i in keys) {
            selectOptions += `
       <option value="${keys[i]}">${keys[i]}</option>
      `;
        }
        `</select>`;
        selectOptions += `</div>`;
        setTimeout(function () {
            $('#LengthSelect').selectpicker({
                'size': 4
            });
        }, 0.01);
        if ($("#LengthSelect").length == 0) {
            btncontainer.append(selectOptions);

            $("#rect-length-img").clone().insertBefore($('#LengthSelect'));
            $("#rectangle-lengthright-text").clone().insertAfter($('#LengthSelect'));
        } else {
            $("#LengthSelect").remove();
            $(".prod-width").show();
            $(".prod-length").remove();
            btncontainer.append(selectOptions);
            $("#rect-length-img").clone().insertBefore($('#LengthSelect'));
            $("#rectangle-lengthright-text").clone().insertAfter($('#LengthSelect'));
        }
    }

    function createGraftableLengthDropDown(data) {
        $("#step3").hide();
        $("#step4").show();
        let btncontainer = "";
        btncontainer = $("#step4 .buttons-view-container .row");
        let selectOptions = "";
        selectOptions += `<div class="prod-length">`;
        selectOptions += `
    <select class="form-select" id="LengthGraftableSelect" onchange="GraftableSelectedOption('Length')" aria-label="Default select example">
      <option value="default" selected>Please select a Length</option>
    `;
        var keys = Object.keys(data);
        for (let i in keys) {
            selectOptions += `
       <option value="${keys[i]}">${keys[i]}</option>
      `;
        }
        `</select>`;
        selectOptions += `</div>`;

        if ($("#LengthGraftableSelect").length == 0) {
            btncontainer.append(selectOptions);
            $("#graft-length-img").clone().insertBefore($('#LengthGraftableSelect'));
            $("#rectangle-lengthright-text").clone().insertAfter($('#LengthGraftableSelect'));
        } else {
            $("#LengthGraftableSelect").remove();
            $(".prod-width").show();
            $(".prod-length").remove();
            btncontainer.append(selectOptions);
            $("#graft-length-img").clone().insertBefore($('#LengthGraftableSelect'));
            $("#rectangle-lengthright-text").clone().insertAfter($('#LengthGraftableSelect'));
        }
    }

    var selectedWidth, selectedLength;
    selectedOption = (type) => {
        var temp = {};
        selectedWidth = $("#widthSelect").val();
        if (type.trim() == "Width") {
            createLengthDropDown(
                finalProductsDataArray[0].Implantable[
                localStorage.getItem("selectedShape")
                ][localStorage.getItem("selectedThickness")][selectedWidth]
            );
            temp = {
                name: "Width: " + selectedWidth + "cm",
                step: 4,
            };
            createBreadCrumb(temp);
            $("#widthSelect").hide();
            $(".prod-width").hide()
        } else {
            selectedWidth = $("#widthSelect").val();
            selectedLength = $("#LengthSelect").val();
            createRadioButtons(
                finalProductsDataArray[0].Implantable[
                localStorage.getItem("selectedShape")
                ][localStorage.getItem("selectedThickness")][selectedWidth][
                selectedLength
                ]
            );
            temp = {
                name: "Length: " + selectedLength + "cm",
                step: 4,
            };
            createBreadCrumb(temp);
        }
    };

    var selectedWidth, selectedLength;
    GraftableSelectedOption = (type) => {
        selectedWidth = $("#widthGraftableSelect").val();
        if (type.trim() == "Width") {
            createRadioButtons(
                finalProductsDataArray[0].Graftable[
                localStorage.getItem("selectedShape")
                ][localStorage.getItem("selectedThickness")][selectedWidth]
            );
            // createGraftableLengthDropDown(
            //   finalProductsDataArray[0].Graftable[
            //   localStorage.getItem("selectedShape")
            //   ][
            //   localStorage.getItem("selectedThickness")
            //   ][selectedWidth]
            // );
            temp = {
                name: selectedWidth + "cm",
                step: 4,
            };
            createBreadCrumb(temp);
            $(".prod-width").hide();
        } else {
            selectedWidth = $("#widthGraftableSelect").val();
            selectedLength = $("#LengthGraftableSelect").val();
            createRadioButtons(
                finalProductsDataArray[0].Graftable[
                localStorage.getItem("selectedShape")
                ][localStorage.getItem("selectedThickness")][selectedWidth][selectedLength]
            );
            temp = {
                name: "Length: " + selectedLength + "cm",
                step: 4,
            };
            createBreadCrumb(temp);
        }
    };

    function createRadioButtons(data) {
        let btncontainer = "";
        let currentStep = parseInt(localStorage.getItem("currentStep"));
        let currentApplication = localStorage.getItem("selectedApplication");
        let currentShape = localStorage.getItem("selectedShape");
        $("#step4").hide();
        $("#step5").show();
        btncontainer = $("#step5 .buttons-view-container .row");
        data = _.sortBy(data, [
            function (o) {
                return o.ThicknessRange;
            },
        ]);
        // console.log(data, "Sorted");
        let radioBtns = "";
        for (let i = 0; i < data.length; i++) {
            radioBtns += `
      <div class="d-flex w-100 align-items-center justify-content-start my-1">
      <span class="${data[i].SKU} d-none">${JSON.stringify(data[i])}</span>
      <input id="${data[i].SKU}" type="radio" value="${data[i].SKU
                }"  name="product" data-val="${data[i]}">
      <label for="${data[i].SKU}" class="mb-0 mx-1"><strong>${data[i].SKU.trim()
                }</strong>${data[i]["SKU Selector Description "]} ${data[i]["Thickness Range"]
                }</label>
      </div>
      `;
        }

        btncontainer.append(radioBtns);
    }

    function createGraftableRadioButtons(data) {
        let btncontainer = "";
        let currentStep = parseInt(localStorage.getItem("currentStep"));
        let currentApplication = localStorage.getItem("selectedApplication");
        let currentShape = localStorage.getItem("selectedShape");
        $("#step3").hide();
        $("#step2").hide();
        $("#step4").hide();
        $("#step5").show();
        $("#step5 .step-number").text("4");
        btncontainer = $("#step5 .buttons-view-container .row");

        let radioBtns = "";
        for (let i = 0; i < data.length; i++) {
            radioBtns += `
      <div class="d-flex w-100 align-items-center justify-content-start my-1">
       <span class="${data[i].SKU} d-none">${JSON.stringify(data[i])}</span>
      <input id="${data[i].SKU}" type="radio" value="${data[i].SKU
                }" name="product" data-val="${data[i]}">
      <label for="${data[i].SKU}" class="mb-0 mx-1"><strong>${data[i].SKU
                }</strong>${data[i]["SKU Selector Description "]} ${data[i]["Thickness Range"]
                }</label>
      </div>
      `;
        }


        btncontainer.append(radioBtns);
        if ($("#step5 .buttons-view-container #graft-bottom-text").length == 0) {
            $('#graft-bottom-text').clone().insertAfter(btncontainer);
            $('#rectangle-bottom-text').hide();
        }
    }

    //handle button clicks on step-2

    showStep3Buttons = (data, obj) => {
        var temp = {};
        if (localStorage.getItem("selectedApplication").trim() === "Implantable") {
            let currentStep = parseInt(localStorage.getItem("currentStep").trim());
            switch (currentStep) {
                case 2:
                    localStorage.setItem("currentStep", 3);
                    localStorage.setItem("selectedShape", data);
                    createButtons(finalProductsDataArray[0].Implantable[data]);
                    temp = { name: data, step: 2 };
                    createBreadCrumb(temp);
                    break;
                case 3:
                    localStorage.setItem("currentStep", 4);
                    localStorage.setItem("selectedThickness", data);

                    if (localStorage.getItem("selectedShape").trim() === "Rectangle") {
                        $('#step5 .screen-head-title').html('Choose your AlloDerm SELECT<sup>&trade;</sup> Rectangle');
                        createWidthDropDown(
                            finalProductsDataArray[0].Implantable[
                            localStorage.getItem("selectedShape")
                            ][localStorage.getItem("selectedThickness")]
                        );
                        temp = {
                            name: data,
                            step: 3,
                        };
                        createBreadCrumb(temp);
                    } else {
                        $('#step5 .screen-head-title').html('Choose your AlloDerm SELECT<sup>&trade;</sup>');
                        createButtons(
                            finalProductsDataArray[0].Implantable[
                            localStorage.getItem("selectedShape")
                            ][localStorage.getItem("selectedThickness")]
                        );
                        temp = { name: data, step: 3 };
                        createBreadCrumb(temp);
                    }

                    break;
                case 4:
                    localStorage.setItem("currentStep", 5);
                    localStorage.setItem("selectedTexture", data);
                    createRadioButtons(
                        finalProductsDataArray[0].Implantable[
                        localStorage.getItem("selectedShape")
                        ][localStorage.getItem("selectedThickness")][
                        localStorage.getItem("selectedTexture")
                        ]
                    );
                    temp = { name: data, step: 4 };
                    createBreadCrumb(temp);
                    break;
            }
        } else if (
            localStorage.getItem("selectedApplication").trim() === "Graftable"
        ) {
            let currentStep = parseInt(localStorage.getItem("currentStep").trim());
            switch (currentStep) {
                case 2:
                    localStorage.setItem("currentStep", 3);
                    localStorage.setItem("selectedShape", data);

                    if (
                        localStorage.getItem("selectedShape").trim() === "Nonperforated"
                    ) {
                        $('#step5 .screen-head-title').html('Choose your AlloDerm SELECT<sup>&trade;</sup>');
                        createButtons(
                            finalProductsDataArray[0].Graftable[
                            localStorage.getItem("selectedShape")
                            ]
                        );
                        temp = {
                            name: data,
                            step: 2,
                        };
                        createBreadCrumb(temp);

                    } else {
                        createGraftableRadioButtons(
                            finalProductsDataArray[0].Graftable[
                            localStorage.getItem("selectedShape")
                            ]
                        );
                        temp = {
                            name: data,
                            step: 2,
                        };
                        createBreadCrumb(temp);
                        return;


                    }
                    break;
                case 3:
                    localStorage.setItem("currentStep", 4);
                    localStorage.setItem("selectedThickness", data);

                    if (
                        localStorage.getItem("selectedShape").trim() === "Nonperforated"
                    ) {
                        createGraftableWidthDropDown(
                            finalProductsDataArray[0].Graftable[
                            localStorage.getItem("selectedShape")
                            ][localStorage.getItem("selectedThickness")]
                        );
                        temp = {
                            name: data,
                            step: 3,
                        };
                        createBreadCrumb(temp);
                    } else {
                        createGraftableRadioButtons(
                            finalProductsDataArray[0].Graftable[
                            localStorage.getItem("selectedShape")
                            ][localStorage.getItem("selectedThickness")]
                        );
                        temp = {
                            name: data,
                            step: 4,
                        };
                        createBreadCrumb(temp);
                    }

                    break;
            }
        }
    };

    $("#select-another-item").click(function () {
        $("#step1").show();
        currSel = "";
        $('.sku-ordering-tool').attr('curr-selection', '');
        $("#step2 .buttons-view-container .row").empty();
        $("#step3 .buttons-view-container .row").empty();
        $("#step4 .buttons-view-container .row").empty();
        $("#step5 .buttons-view-container .row").empty();
        $("#step2").hide();
        $("#step3").hide();
        $("#step4").hide();
        $("#step5").hide();
        $(".breadcrumb-section ol").empty();
    });

    $("#select-another-item-form").click(function () {
        $("#complete-order-modal").modal("hide");
        $("#select-another-item").trigger("click");
    });
    if (
        sessionStorage.getItem("CartItems") != null) {
        sessionStorage.removeItem("CartItems");
    }

    $('.cart-btn').addClass("disabled").css({ "pointer-events": "none", "opacity": "0.5" });
    $("#complete-order").addClass("disabled").css("pointer-events", "none");
    $("#add-to-cart").click(function () {
        if ($(".sku-ordering-tool input[type='radio']").is(":checked") == true) {
            getSelectedProductsData();
        } else {
            $('#notadded-list').modal();
        }
    });

    //sessionStorage.setItem("CartItems", "");
    var selectedata = "";
    var selectedProd = [];
    function getSelectedProductsData() {
        selectedata = JSON.parse(
            $(".sku-ordering-tool input[type=radio]:checked")
                .parent()
                .find(
                    "." + $(".sku-ordering-tool input[type=radio]:checked").attr("id")
                )[0].innerText
        );
        var IsDuplicateFound = selectedProd.filter(checkDuplicates);
        if (IsDuplicateFound.length > 0) {
            $('#in-list').modal();
        } else {
            //selectedata.Quantity = 1;
            if (sessionStorage.getItem("CartItems") == null) {
                selectedProd.push(selectedata);
            } else {
                let sessionData = JSON.parse(sessionStorage.getItem("CartItems"));
                selectedProd = [];
                if (sessionData.length > 0) {
                    sessionData.map((obj) => {
                        selectedProd.push(obj);
                    });
                }
                selectedProd.push(selectedata);
            }
            sessionStorage.setItem("CartItems", JSON.stringify(selectedProd));
            $("#complete-order").removeClass("disabled").css("pointer-events", "all");
            $(".cart-btn").removeClass("disabled").css({ "pointer-events": "all", "opacity": "1" });
            updateCart(selectedProd);
            $("#add-to-cart-modal").modal();
        }
    }

    function checkDuplicates(x) {
        return _.isEqual(x, selectedata);
    }

    function updateCart(data) {
        let cartQtySpan = $(".cart-btn .cart-qty");
        cartQtySpan.show();
        cartQtySpan.addClass("d-flex");
        for (let i = 0; i < cartQtySpan.length; i++) {
            cartQtySpan[i].innerText = data.length;
        }
    }

    $("#complete-order").click(function () {
        $("#complete-order-modal").modal();
        let cartData = JSON.parse(sessionStorage.getItem("CartItems"));
        createCartTable(cartData);
    });

    function createCartTable(data) {
        //sessionStorage.setItem("CartItems", "");
        let cartTable = "";
        let cartTableContainer = $("#qty-table table tbody");
        cartTableContainer.empty();
        var prdData = JSON.stringify(data);
        for (var i = 0; i < data.length; i++) {
            cartTable += `
        <tr>
        <td class="quantity"><select id="prodQty_${i}" onchange="updateProductQty(${i}, this.value)" >`;

            for (let j = 0; j <= 10; j++) {
                if (j == 1) {
                    if (data[i].Quantity) {
                        cartTable += `
              <option value="${data[i].Quantity}" selected>${data[i].Quantity}</option>
            `;
                    } else {
                        cartTable += `
          <option value="${j}" selected>${j}</option>
          `;
                    }
                } else {
                    cartTable += `
          <option value="${j}">${j}</option>
          `;
                }
            }

            cartTable += `
        </select></td>
        <td class="sku"><strong>${data[i].SKU}</strong></td>
        <td class="sku-desc">${data[i]["SKU Selector Description "]} ${data[i]["Thickness Range"]} </td>
        </tr>
      `;
            if (data[i].Quantity != undefined && data[i].Quantity != "") {
                $("#prodQty_" + i).val(data[i].Quantity);
            }
        }

        cartTableContainer.append(cartTable);
        setTimeout(function () {
            $('.quantity select').selectpicker({
                'size': 11,
                'dropupAuto': false
            });
        }, 0.01);

    }


    updateProductQty = (index, value) => {
        if (value == 0) {
            $('#remove-from-list').modal();
            $('#remove-from-list').on('hidden.bs.modal', function () {
                $('#complete-order-modal').modal('hide');
            });

        }
        let orderData = JSON.parse(sessionStorage.getItem("CartItems"));
        orderData[index].Quantity = $("#prodQty_" + index).val();
        sessionStorage.setItem("CartItems", JSON.stringify(orderData));
    };
    $("#complete-your-order-form").click(function () {
        DoCartTableCreation(JSON.parse(sessionStorage.getItem("CartItems")));
    });
    $("#Email").attr("type", "email");
    $("#Phone-Number").mask("999-999-9999");
    var userData,
        orderDataArr = [],
        orderDatObj = {};
    function DoCartTableCreation(getData) {

        //commenting the below lines because there is no-longer form fields are present as per requirement


        // var Name = $("#Name").val().trim();
        // if (Name == "" && Name.length == 0) {
        //   $("#Name").parent().find(".error-msg").show();
        //   $("#Name").parent().addClass("invalid-field");
        // } else {
        //   $("#Name").parent().find(".error-msg").hide();
        //   $("#Name").parent().removeClass("invalid-field");
        // }

        // var AccountName = $("#Account-Name").val().trim();
        // if (AccountName == "" && AccountName.length == 0) {
        //   $("#Account-Name").parent().find(".error-msg").show();
        //   $("#Account-Name").parent().addClass("invalid-field");
        // } else {
        //   $("#Account-Name").parent().find(".error-msg").hide();
        //   $("#Account-Name").parent().removeClass("invalid-field");
        // }
        // var ActNum = $("#Account-Number").val().trim();
        // if (ActNum == "" && ActNum.length == 0) {
        //   $("#Account-Number").parent().find(".error-msg").show();
        //   $("#Account-Number").parent().addClass("invalid-field");
        // } else {
        //   $("#Account-Number").parent().find(".error-msg").hide();
        //   $("#Account-Number").parent().removeClass("invalid-field");
        // }
        // var PhnNum = $("#Phone-Number").val().trim();
        // if (PhnNum == "" && PhnNum.length == 0) {
        //   $("#Phone-Number").parent().find(".error-msg").show();
        //   $("#Phone-Number").parent().addClass("invalid-field");
        // } else if (PhnNum != "" && PhnNum.length > 0) {
        //   let phnValidationStatus = ValidatePhoneNumber(PhnNum);
        //   if (!phnValidationStatus) {
        //     $("#Phone-Number").parent().find(".error-msg").show();
        //     $("#Phone-Number")
        //       .parent()
        //       .find(".error-msg")
        //       .text("Please enter a valid Phone Number");
        //     $("#Phone-Number").parent().addClass("invalid-field");
        //   } else {
        //     $("#Phone-Number").parent().find(".error-msg").hide();
        //     $("#Phone-Number").parent().removeClass("invalid-field");
        //   }
        // } else {
        //   $("#Phone-Number").parent().find(".error-msg").hide();
        //   $("#Phone-Number").parent().removeClass("invalid-field");
        // }
        // var Email = $("#Email").val().trim();
        // if (Email == "" && Email.length == 0) {
        //   $("#Email").parent().find(".error-msg").show();
        //   $("#Email").parent().addClass("invalid-field");
        //   $("#Email").parent().find(".error-msg").text("Email cannot be blank");
        // } else if (Email.length != "" && Email.length > 0) {
        //   let EmailValidationStatus = validateEmails(Email);
        //   if (!EmailValidationStatus) {
        //     $("#Email").parent().find(".error-msg").show();
        //     $("#Email")
        //       .parent()
        //       .find(".error-msg")
        //       .text("Please enter a valid Email");
        //     $("#Email").parent().addClass("invalid-field");
        //   } else {
        //     $("#Email").parent().find(".error-msg").hide();
        //     $("#Email").parent().removeClass("invalid-field");
        //   }
        // } else {
        //   $("#Email").parent().find(".error-msg").hide();
        //   $("#Email").parent().removeClass("invalid-field");
        // }
        // var ShipAdd = $("#Shipping-Address").val().trim();
        // if (ShipAdd == "" && ShipAdd.length == 0) {
        //   $("#Shipping-Address").parent().find(".error-msg").show();
        //   $("#Shipping-Address").parent().addClass("invalid-field");
        // } else {
        //   $("#Shipping-Address").parent().find(".error-msg").hide();
        //   $("#Shipping-Address").parent().removeClass("invalid-field");
        // }
        // function validateEmails(email) {
        //   if (
        //     /^\s*$/.test(email) ||
        //     !/^[-0-9a-zA-Z.+_]+@[-0-9a-zA-Z.+_]+[\.]{1}[0-9a-zA-Z]+[\.]?[0-9a-zA-Z]+$/.test(
        //       email
        //     )
        //   ) {
        //     return false;
        //   }
        //   return true;
        // }

        // function ValidatePhoneNumber(inputtxt) {
        //   var phonenoRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
        //   if (phonenoRegex.test(inputtxt)) {
        //     return true;
        //   } else {
        //     return false;
        //   }
        // }




        // if ($("#complete-order-modal form .form-group").hasClass("invalid-field")) {
        //   return;
        // }
        // else {
        //   orderDatObj = {};
        //   orderDataArr = [];
        //   $("#qty-table tr").each(function () {
        //     if ($(this).children().find("select option:selected").val() > 0) {
        //       orderDatObj = {
        //         itemQty: parseInt(
        //           $(this).children().find("select option:selected").val()
        //         ),
        //         SKU: $(this).children()[1].innerText,
        //         SKUDesc: $(this).children()[2].innerText,
        //       };
        //       orderDataArr.push(orderDatObj);
        //     }

        //     if (parseInt($(this).children().find("select option:selected").val())) {
        //       // console.log("OrderDataArr: " + orderDataArr);
        //       // userData = {
        //       //   Name: $("#Name").val(),
        //       //   MDName: $("#MDName").val(),
        //       //   AccountName: $("#Account-Name").val(),
        //       //   AccountNumber: $("#Account-Number").val(),
        //       //   PhoneNumber: $("#Phone-Number").val(),
        //       //   Extension: $("#Extension").val(),
        //       //   ShippingAddress: $("#Shipping-Address").val(),
        //       //   Email: $("#Email").val(),
        //       //   OrderData: orderDataArr,
        //       // };
        //       $("#complete-order-modal").modal("hide");
        //       $("#final-order-modal").modal();
        //       passFormData(userData);
        //     } else {
        //       window.confirm(
        //         "One of the Order Quantity is Zero. Do you wish to Proceed?"
        //       );
        //       return;
        //     }
        //   });
        // }

        orderDatObj = {};
        orderDataArr = [];
        var qtyCount = 0;
        var allCartData = getData;
        var tempArr = [];
        var splicedArr = [];
        $("#qty-table tr").each(function () {
            if ($(this).children().find("select option:selected").val() > 0) {
                orderDatObj = {
                    itemQty: parseInt(
                        $(this).children().find("select option:selected").val()
                    ),
                    SKU: $(this).children()[1].innerText,
                    SKUDesc: $(this).children()[2].innerText,
                };
                orderDataArr.push(orderDatObj);
            }
            else if ($(this).children().find("select option:selected").val() == 0) {
                let i = 0;
                for (i in getData) {
                    if ($(this).children()[1].innerText == allCartData[i].SKU) {
                        allCartData.splice(i, 1);
                    }

                    i++;
                }
                selectedProd = allCartData;
            }
            if (parseInt($(this).children().find("select option:selected").val())) {
                userData = {
                    OrderData: orderDataArr,
                };


                $("#complete-order-modal").modal("hide");
                $("#final-order-modal").modal();
                passFormData(userData);
            }


        });

        sessionStorage.setItem("CartItems", JSON.stringify(selectedProd));
        updateCart(orderDataArr);
        // createCartTable(allCartData);
        qtyCount = orderDataArr.every(x => x.itemQty == 0);
        if (qtyCount) {
            $('#remove-from-list').modal();
            return;
        }


    }

    function passFormData(obj) {
        // $("#CustFullname").text(obj.Name);
        // $("#CustMDname").text(obj.MDName);
        // $("#CustActName").text(obj.AccountName);
        // $("#CustActNum").text(obj.AccountNumber);
        // $("#CustPhnNum").text(obj.PhoneNumber);
        // $("#CustExt").text(obj.Extension);
        // $("#CustShipAdd").text(obj.ShippingAddress);
        // $("#CustEmail").text(obj.Email);
        createFinalOrderTable(obj.OrderData);
    }
    $("#qty-table table tbody").empty();
    $("#order-qty-table table tbody").empty();
    function createFinalOrderTable(data) {
        let tablehtml = "";
        let OrderTableContainer = $("#order-qty-table table tbody");
        OrderTableContainer.empty();
        for (let i = 0; i < data.length; i++) {
            tablehtml += `
        <tr>
        <td class="Qty">${data[i].itemQty}</td>
        <td class="sku"><strong>${data[i].SKU}</strong></td>
        <td class="sku-desc">${data[i].SKUDesc} </td>
        </tr>
      `;
        }
        OrderTableContainer.append(tablehtml);
    }
    var orderDatFinalObj = {},
        formData = {},
        orderDataFinalArr = [];

    $("#download-order-pdf").click(function () {
        orderDataFinalArr = [];
        $("#order-qty-table tr").each(function () {
            orderDatFinalObj = {
                ItemCode: $(this).children()[1].innerText,
                OrderDescription: $(this).children()[2].innerText,
                Quantity: $(this).children()[0].innerText,
            };
            orderDataFinalArr.push(orderDatFinalObj);
        });
        formData = {
            // Name: $("#CustFullname").text().trim(),
            // MDName: $("#CustMDname").text().trim(),
            // AccountName: $("#CustActName").text().trim(),
            // ShipToAccount: $("#CustActNum").text().trim(),
            // PhoneNumber: $("#CustPhnNum").text().trim(),
            // Extension: $("#CustExt").text().trim(),
            // ShipAddress: $("#CustShipAdd").text().trim(),
            // Email: $("#CustEmail").text().trim(),
            OrderDetails: orderDataFinalArr,
        };
        /*XML call for pdf download*/
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("POST", "AllodermDownloadPDF/PDFDownload");
        xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xmlhttp.responseType = "blob";
        xmlhttp.onload = function (e) {
            if (this.status == 200) {
                var blob = new Blob([this.response], { type: "application/pdf" });
                console.log("download pdf");
                if (navigator.appVersion.toString().indexOf(".NET") > 0) {
                    window.navigator.msSaveBlob(blob, "OrderPDF.pdf");
                } else {
                    var blob = new Blob([this.response], { type: "application/pdf" });
                    var file = window.URL.createObjectURL(blob);
                    var a = document.createElement("a");
                    var isDownload = "false";
                    a.target = "_blank";
                    a.href = file;
                    if (isDownload) {
                        a.download = "OrderPDF.pdf";
                    }
                    document.body.appendChild(a);
                    if (isDownload) {
                        a.click();
                    } else {
                        window.open(file, "_blank");
                    }
                    //$('#SuccessEmail').modal('show');
                    setTimeout(function () {
                        document.body.removeChild(a);
                        window.URL.revokeObjectURL(file);
                    }, 100);
                }
                $('.step0-wrapper').show();
                $('.sku-box, .sku-ordering-tool .header-section, .sku-ordering-tool .step-1').hide();
                $('#select-another-item').trigger('click');
                $('.cart-qty').removeClass('d-flex');
                $('.cart-qty').hide();
                currSel = "";
                $('.sku-ordering-tool').attr('curr-selection', '');
                $('#final-order-modal').modal('hide');

            } else {
                //parent.removeClass('building');
                //parent.addClass('initial');
                console.log("error");
            }
        };
        xmlhttp.send(JSON.stringify({ _answers: formData }));
    });


    //commenting the code related to send order to customer care
    // $("#send-your-order").click(function (e) {
    //   e.preventDefault();
    //   grecaptcha.execute();
    // });

    $(".cart-btn").click(function () {
        $("#complete-order").trigger("click");
    });

    var currSel = "";
    function createBreadCrumb(obj) {
        $(".breadcrumb-section ol").append(
            `<li class="breadcrumb-item"><a href="javascript:void(0);" data-step="${obj.step}" class="breadcrumb-link">${obj.name}</li>`
        );
        currSel += obj.name.trim().toLowerCase();
        $('.sku-ordering-tool').attr("curr-selection", currSel);
        if ($('.sku-ordering-tool').attr('curr-selection').toLowerCase() == "implantablerectangle") {
            $('#step3 .screen-head-title').text("Select your texture");
        }
    }

    $(".breadcrumb-section ol").on("click", ".breadcrumb-link", function () {
        $(".steps").hide();
        var currStep = $("#step" + parseInt($(this).data("step")));
        currStep.show();
        $("#step2").removeClass("implantable-step2");
        $("#step2").removeClass("graftable-step2");

        if (currSel.includes($(this).text().trim().toLowerCase())) {
            currSel.split($(this).text().trim().toLowerCase())[0];
            currSel = currSel.split($(this).text().trim().toLowerCase())[0];;
            $('.sku-ordering-tool').attr("curr-selection", currSel);
        }

        $(this).parent().nextAll().remove();
        $(this).parent().remove();
        currStep.parent().nextAll().find(".buttons-view-container .row").empty();
        localStorage.setItem("currentStep", parseInt($(this).data("step")));

        if ($(this).text().trim().toLowerCase().includes("width")) {
            $("#step4 .step-number").text("4");
            $("#LengthSelect").hide();
            $("#widthSelect").show();
            $(".prod-width").show();
            $(".prod-length").hide();
        }
    });

    function appendImages(currStep, selectedApp) {
        if (selectedApp.trim().toLowerCase() == "implantable" && currStep == 2) {
            if ($(".implantable-step2 .buttons-view-container .row .col #rectangle-img").length == 0) {
                $(".implantable-step2 .buttons-view-container .row .col:first-of-type").append($("#rectangle-img").clone());
            }

            if ($(".implantable-step2 .buttons-view-container .row .col #contour-img").length == 0) {
                $(".implantable-step2 .buttons-view-container .row .col:nth-of-type(2)").append($("#contour-img").clone());
            }

            if ($(".implantable-step2 .buttons-view-container .row .col #restore-img").length == 0) {
                $(".implantable-step2 .buttons-view-container .row .col:nth-of-type(3)").append($("#restore-img").clone());
            }
        } else if (
            selectedApp.trim().toLowerCase() == "graftable" &&
            currStep == 2
        ) {
            if ($(".graftable-step2 .buttons-view-container .row .col #non-meshed-img").length == 0) {
                $(".graftable-step2 .buttons-view-container .row .col:first-of-type").append($("#non-meshed-img").clone());
            }
            if ($(".graftable-step2 .buttons-view-container .row .col #fenestrated-img").length == 0) {
                $(".graftable-step2 .buttons-view-container .row .col:nth-of-type(2)").append($("#fenestrated-img").clone());
            }
            if ($(".graftable-step2 .buttons-view-container .row .col #meshed-img").length == 0) {
                $(".graftable-step2 .buttons-view-container .row .col:nth-of-type(3)").append($("#meshed-img").clone());
            }
        }
    }

    $('#clear-cart-data').click(function () {
        $('.cart-btn').addClass("disabled").css({ "pointer-events": "none", "opacity": "0.5" });
        currSel = "";
        $('.sku-ordering-tool').attr('curr-selection', '');
        $('#clear-list').modal();
    });

    $("#clear-list").on("hidden.bs.modal", function () {
        selectedata = "";
        selectedProd = [];
        $('.sku-ordering-tool').attr('curr-selection', '');
        sessionStorage.removeItem("CartItems");
        $('#order-qty-table table tbody').empty();
        $("#final-order-modal").modal('hide');
        $('.steps .cart-btn .cart-qty').text("");
        $('.steps .cart-btn .cart-qty').removeClass("d-flex");
        $('.steps .cart-btn .cart-qty').hide();
        $('#select-another-item').click();
    });

    $("#final-order-modal").on("hidden.bs.modal", function () {
        setTimeout(function () {
            if ($(window).width() < 768) {
                $("html, body").animate(
                    {
                        scrollTop: $(".sku-ordering-tool").offset().top - 150,
                    },
                    500
                );
            } else {
                $("html, body").animate(
                    {
                        scrollTop: $(".sku-ordering-tool").offset().top - 70,
                    },
                    500
                );
            }
        }, 500);
    });
});


//as send order is disregarded from scope, recaptcha is no longer required
// commenting the code below
// function recaptchaCallBack() {
//   return new Promise(function (resolve, reject) {
//     var orderDatFinalObj = {},
//       formData = {},
//       orderDataFinalArr = [];
//     $("#order-qty-table tr").each(function () {
//       orderDatFinalObj = {
//         ItemCode: $(this).children()[1].innerText,
//         OrderDescription: $(this).children()[2].innerText,
//         Quantity: $(this).children()[0].innerText,
//       };
//       orderDataFinalArr.push(orderDatFinalObj);
//     });
//     formData = {
//       Name: $("#CustFullname").text().trim(),
//       MDName: $("#CustMDname").text().trim(),
//       AccountName: $("#CustActName").text().trim(),
//       ShipToAccount: $("#CustActNum").text().trim(),
//       PhoneNumber: $("#CustPhnNum").text().trim(),
//       Extension: $("#CustExt").text().trim(),
//       ShipAddress: $("#CustShipAdd").text().trim(),
//       Email: $("#CustEmail").text().trim(),
//       OrderStatus: "False",
//       OrderDetails: orderDataFinalArr,
//     };

//     let response = grecaptcha.getResponse();
//     if (response == "") {
//       grecaptcha.render();
//     }
//     else {
//       $.ajax({
//         url: "/SelectionOrderDetails/SelectionOrderInfo",
//         cache: false,
//         type: "POST",
//         data: formData,
//         success: function (data) {
//           if (data == "Success") {
//             $("#final-order-modal").modal("hide");
//             $("#final-thank-you-modal").modal();
//           } else {
//             $("#final-order-modal").modal("hide");
//             $("#final-thank-you-modal .modal-body .modal-heading p").text(
//               "Sorry! We encountered an issue.Please try again!"
//             );
//             $("#final-thank-you-modal").modal();
//           }
//           sessionStorage.setItem("CartItems", "");
//           $('.steps .cart-btn .cart-qty').text("");
//           $('.steps .cart-btn .cart-qty').removeClass("d-flex");
//           $('.steps .cart-btn .cart-qty').hide();
//           $('#select-another-item').click();
//           //grecaptcha.reset();
//         },
//         error: function (error) {
//           console.log(error);
//         },
//       });

//     }
//     resolve();
//   });
// }


